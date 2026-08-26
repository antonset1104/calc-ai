/**
 * check-static.mjs — Pemeriksa integritas situs statis.
 *
 * Dua cacat nyata yang ditangkap berkas ini, keduanya pernah terjadi di repo
 * ini dan keduanya tidak menimbulkan galat build apa pun:
 *
 *   1. Berkas JavaScript diganti nama (js/lead_sync.js -> js/lead_sync.v11.js)
 *      dan satu tag <script src> tertinggal menunjuk nama lama. Halaman tetap
 *      terbuka; fiturnya saja yang diam-diam mati.
 *
 *   2. Nama berkas berubah, tetapi CORE_ASSETS di sw.js masih menunjuk nama
 *      lama. cache.addAll() menolak seluruh daftar bila satu entri saja gagal,
 *      sehingga service worker tidak pernah aktif dan setiap pengunjung yang
 *      kembali terus dilayani versi cache yang basi. Konsolnya senyap.
 *
 * Tidak memakai dependensi apa pun: hanya modul bawaan Node.
 *
 *   node .github/ci/check-static.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');

const problems = [];
const notes = [];

/* ---------------------------------------------------------------- *
 * 1. Setiap rujukan berkas lokal di HTML harus benar-benar ada.
 * ---------------------------------------------------------------- */

const SKIP_DIRS = new Set(['.git', '.github', 'node_modules', 'dist', '__pycache__', '.wrangler']);

function htmlFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      htmlFiles(path.join(dir, entry.name), acc);
    } else if (entry.name.endsWith('.html')) {
      acc.push(path.join(dir, entry.name));
    }
  }
  return acc;
}

const REFERENCE = /(?:src|href)\s*=\s*["']([^"']+)["']/gi;

function isLocal(ref) {
  return !/^(?:https?:)?\/\//i.test(ref) &&
    !ref.startsWith('data:') && !ref.startsWith('mailto:') &&
    !ref.startsWith('tel:') && !ref.startsWith('#') &&
    !ref.startsWith('javascript:');
}

/** Hanya berkas aset yang diperiksa; tautan halaman ditangani perutean host. */
const ASSET_EXT = /\.(?:js|mjs|css|png|jpe?g|webp|gif|svg|avif|ico|json|webmanifest|woff2?|ttf|mp3|mp4|pdf|xml|txt)$/i;

const pages = htmlFiles(REPO);
let checked = 0;

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  for (const match of html.matchAll(REFERENCE)) {
    const raw = match[1].trim();
    if (!isLocal(raw)) continue;
    const clean = raw.split('?')[0].split('#')[0];
    if (!clean || !ASSET_EXT.test(clean)) continue;
    checked += 1;
    const target = clean.startsWith('/')
      ? path.join(REPO, clean.slice(1))
      : path.join(dir, clean);
    if (!fs.existsSync(target)) {
      problems.push(`${path.relative(REPO, file)} merujuk ${raw} — berkasnya tidak ada`);
    }
  }
}
notes.push(`${checked} rujukan aset di ${pages.length} berkas HTML diperiksa`);

/* ---------------------------------------------------------------- *
 * 2. Daftar prasinggah service worker harus menunjuk berkas nyata.
 * ---------------------------------------------------------------- */

const swPath = path.join(REPO, 'sw.js');
if (fs.existsSync(swPath)) {
  const sw = fs.readFileSync(swPath, 'utf8');

  /**
   * Nama konstanta berbeda antar-repo (CACHE_NAME dan CORE_ASSETS di satu
   * tempat, VERSION dan CORE di tempat lain), jadi keduanya ditemukan dari
   * pemakaiannya — caches.open(...) dan .addAll(...) — bukan dari namanya.
   */
  const constArray = (name) => {
    const m = new RegExp(`const\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`).exec(sw);
    return m ? [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]) : null;
  };
  const constString = (name) =>
    new RegExp(`const\\s+${name}\\s*=\\s*['"][^'"]+['"]`).test(sw);

  const cacheIdent = /caches\.open\(\s*([A-Za-z_$][\w$]*)\s*\)/.exec(sw)?.[1];
  if (!cacheIdent) {
    problems.push('sw.js: tidak ada caches.open(...) dengan konstanta — versi cache tidak bisa ditelusuri');
  } else if (!constString(cacheIdent)) {
    problems.push(`sw.js: caches.open(${cacheIdent}) tetapi const ${cacheIdent} tidak ditemukan sebagai teks`);
  } else {
    notes.push(`sw.js: versi cache dipegang const ${cacheIdent}`);
  }

  const precacheIdent = /\.addAll\(\s*([A-Za-z_$][\w$]*)\s*\)/.exec(sw)?.[1];
  const lists = [];
  if (precacheIdent) lists.push([precacheIdent, constArray(precacheIdent)]);
  else notes.push('sw.js: tidak ada .addAll(...) — daftar prasinggah dilewati');
  if (constArray('NETWORK_FIRST')) lists.push(['NETWORK_FIRST', constArray('NETWORK_FIRST')]);

  for (const [name, list] of lists) {
    if (!list) {
      problems.push(`sw.js: ${name} dipakai tetapi definisinya tidak terbaca`);
      continue;
    }
    let missing = 0;
    for (const entry of list) {
      const rel = entry.replace(/^\.?\//, '') || 'index.html';
      if (!fs.existsSync(path.join(REPO, rel))) {
        problems.push(`sw.js ${name} memuat ${entry} — berkasnya tidak ada (cache.addAll menolak seluruh daftar bila satu entri gagal, sehingga service worker tidak akan pernah aktif)`);
        missing += 1;
      }
    }
    notes.push(`sw.js ${name}: ${list.length} entri diperiksa, ${missing} hilang`);
  }
}

/* ---------------------------------------------------------------- *
 * 3. Setiap berkas JavaScript harus bisa diurai.
 *
 * Catatan penting: `node --check` DIAM-DIAM MELULUSKAN berkas .js bermodul
 * ES yang sintaksnya rusak. Node mendeteksi berkas itu sebagai modul lalu
 * tidak melaporkan galatnya. Diverifikasi pada Node 24:
 *
 *     export const y = 1;
 *     const z = ;            <- jelas rusak
 *
 * lulus `node --check d.js`, tetapi gagal pada `node --check d.mjs`.
 * Karena itu berkas yang mengandung import/export tingkat atas disalin ke
 * berkas .mjs sementara sebelum diperiksa.
 * ---------------------------------------------------------------- */

function jsFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      jsFiles(path.join(dir, entry.name), acc);
    } else if (/\.(?:js|mjs|cjs)$/.test(entry.name)) {
      acc.push(path.join(dir, entry.name));
    }
  }
  return acc;
}

const { execFileSync } = await import('node:child_process');
const os = await import('node:os');

const LOOKS_LIKE_MODULE = /^\s*(?:export[\s{*]|import[\s{*(])/m;
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-syntax-'));

const scripts = jsFiles(REPO);
let asModule = 0;
for (const file of scripts) {
  const source = fs.readFileSync(file, 'utf8');
  let target = file;
  if (path.extname(file) === '.js' && LOOKS_LIKE_MODULE.test(source)) {
    target = path.join(tmpDir, `${path.basename(file, '.js')}.mjs`);
    fs.writeFileSync(target, source);
    asModule += 1;
  }
  try {
    execFileSync(process.execPath, ['--check', target], { stdio: 'pipe' });
  } catch (error) {
    // Berkas modul diperiksa lewat salinan .mjs sementara; ganti jejak
    // path sementara itu dengan nama berkas aslinya agar log CI terbaca.
    const detail = String(error.stderr || error.message)
      .split('\n').filter(Boolean).slice(0, 2).join(' ').trim()
      .split(tmpDir).join('')
      .replace(/^\/?[^\s:]*?\.mjs:/, 'baris ');
    problems.push(`${path.relative(REPO, file)} tidak bisa diurai: ${detail}`);
  }
}
fs.rmSync(tmpDir, { recursive: true, force: true });
notes.push(`${scripts.length} berkas JavaScript diurai (${asModule} sebagai modul ES)`);

/* ---------------------------------------------------------------- */

console.log('\nPemeriksaan situs statis');
for (const n of notes) console.log(`  · ${n}`);

if (problems.length) {
  console.error(`\n✗ ${problems.length} masalah ditemukan:`);
  for (const p of problems) console.error(`    ${p}`);
  process.exit(1);
}
console.log('\n✓ Seluruh rujukan aset, daftar service worker, dan sintaks JavaScript sehat.');
