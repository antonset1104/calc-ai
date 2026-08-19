// test_sit.mjs — Static SIT/UAT Test for LLM Lab App
import { readFileSync } from 'fs';

const results = [];
const PASS = (desc) => results.push({ pass: true, desc });
const FAIL = (desc, detail) => results.push({ pass: false, desc, detail });

// 1. All 9 view modules import correctly
const views = ['leaderboard','compare','selector','benchmarks','simulator','tokenizer','context','prompting','glossary'];
for (const v of views) {
  try {
    await import('./js/views/' + v + '.js');
    PASS('View: ' + v + '.js imports OK');
  } catch (e) {
    FAIL('View: ' + v + '.js', e.message);
  }
}

// 2. All data modules
const datas = [
  { path: './js/data/leaderboard.js', key: 'LEADERBOARD_MODELS' },
  { path: './js/data/models.js', key: 'MODELS' },
  { path: './js/data/glossary.js', key: 'GLOSSARY' },
];
for (const d of datas) {
  try {
    const m = await import(d.path);
    if (m[d.key] && m[d.key].length > 0) {
      PASS(d.path.split('/').pop() + ' has ' + m[d.key].length + ' entries');
    } else {
      FAIL(d.path.split('/').pop(), 'Empty or missing export: ' + d.key);
    }
  } catch (e) {
    FAIL(d.path.split('/').pop(), e.message);
  }
}

// 3. app.js has no SHELL[] old references
const appSrc = readFileSync('./js/app.js', 'utf8');
if (/SHELL\[/.test(appSrc)) {
  FAIL('app.js: SHELL[] reference', 'Old SHELL[lang] still present');
} else {
  PASS('app.js: No SHELL[] references');
}
if (/SHELL_TRANSLATIONS/.test(appSrc)) {
  PASS('app.js: SHELL_TRANSLATIONS used correctly');
} else {
  FAIL('app.js: SHELL_TRANSLATIONS', 'Not found in app.js');
}

// 4. app.js has hashchange listener
if (/hashchange.*renderRoute|renderRoute.*hashchange/.test(appSrc)) {
  PASS('app.js: hashchange -> renderRoute wired');
} else {
  FAIL('app.js: hashchange', 'No hashchange listener found');
}

// 5. app.js has proper buildNav logic (only once)
const buildNavCount = (appSrc.match(/function buildNav\(/g) || []).length;
if (buildNavCount === 1) PASS('app.js: buildNav defined exactly once');
else FAIL('app.js: buildNav', 'Defined ' + buildNavCount + ' times (expected 1)');

// 6. All required IDs in index.html
const html = readFileSync('./index.html', 'utf8');
const requiredIds = [
  'nav', 'tabbar', 'view', 'loadbar',
  'palette', 'paletteInput', 'paletteList', 'paletteForm', 'paletteBtn',
  'langModal', 'langGrid', 'langPickerBtn', 'closeLangModal',
  'themeBtn', 'radarModal', 'radarForm', 'radarBtn',
  'advisoryModal', 'advisoryForm', 'toast',
  'currentLangFlag', 'currentLangCode',
];
for (const id of requiredIds) {
  if (html.includes(`id="${id}"`)) {
    PASS('HTML id#' + id);
  } else {
    FAIL('HTML id#' + id, 'Missing in index.html');
  }
}

// 7. i18n: 11 languages supported
const i18n = await import('./js/lib/i18n.js');
if (i18n.SUPPORTED_LANGUAGES.length === 11) {
  PASS('i18n: 11 languages supported');
} else {
  FAIL('i18n: Languages count', 'Expected 11, got ' + i18n.SUPPORTED_LANGUAGES.length);
}

// 8. RTL support for Arabic
const arLang = i18n.SUPPORTED_LANGUAGES.find((l) => l.code === 'ar');
if (arLang?.dir === 'rtl') {
  PASS('i18n: Arabic RTL dir configured');
} else {
  FAIL('i18n: Arabic RTL', 'dir attribute missing or wrong');
}

// 9. SHELL_TRANSLATIONS has all 11 languages
const langKeys = Object.keys(i18n.SHELL_TRANSLATIONS);
if (langKeys.length >= 11) {
  PASS('i18n: SHELL_TRANSLATIONS has ' + langKeys.length + ' languages');
} else {
  FAIL('i18n: SHELL_TRANSLATIONS', 'Only ' + langKeys.length + ' languages (expected 11)');
}

// 10. LEADERBOARD_MODELS has at least 25 models
const lb = await import('./js/data/leaderboard.js');
if (lb.LEADERBOARD_MODELS.length >= 25) {
  PASS('leaderboard.js: ' + lb.LEADERBOARD_MODELS.length + ' models (>=25)');
} else {
  FAIL('leaderboard.js: model count', 'Only ' + lb.LEADERBOARD_MODELS.length + ' models');
}

// 11. All models have required fields
const requiredModelFields = ['id', 'name', 'vendor', 'overall', 'scores', 'blend', 'in', 'out', 'ctx', 'speed', 'elo', 'pros', 'cons'];
let modelFieldErrors = 0;
for (const m of lb.LEADERBOARD_MODELS) {
  for (const f of requiredModelFields) {
    if (!(f in m)) {
      FAIL('Model data: ' + m.id, 'Missing field: ' + f);
      modelFieldErrors++;
      break;
    }
  }
}
if (modelFieldErrors === 0) {
  PASS('Model data: All ' + lb.LEADERBOARD_MODELS.length + ' models have required fields');
}

// 12. CATEGORIES has correct count
if (lb.CATEGORIES.length === 8) {
  PASS('leaderboard.js: 8 categories defined');
} else {
  FAIL('leaderboard.js: categories', 'Expected 8, got ' + lb.CATEGORIES.length);
}

// 13. USE_CASE_PROFILES present
if (Object.keys(lb.USE_CASE_PROFILES).length >= 5) {
  PASS('leaderboard.js: ' + Object.keys(lb.USE_CASE_PROFILES).length + ' use-case profiles');
} else {
  FAIL('leaderboard.js: USE_CASE_PROFILES', 'Too few profiles');
}

// 14. GLOSSARY has terms
const gl = await import('./js/data/glossary.js');
if (gl.GLOSSARY.length >= 100) {
  PASS('glossary.js: ' + gl.GLOSSARY.length + ' terms (>=100)');
} else {
  FAIL('glossary.js: term count', 'Only ' + gl.GLOSSARY.length + ' terms');
}

// 15. Service worker exists
try {
  readFileSync('./sw.js');
  PASS('sw.js: Service worker file exists');
} catch {
  FAIL('sw.js', 'Missing service worker');
}

// 16. manifest.json exists
try {
  const manifest = JSON.parse(readFileSync('./manifest.json', 'utf8'));
  if (manifest.name && manifest.icons) PASS('manifest.json: Valid PWA manifest');
  else FAIL('manifest.json', 'Missing name or icons field');
} catch {
  FAIL('manifest.json', 'Missing or invalid manifest');
}

// --- Summary ---
console.log('\n╔══════════════════════════════════════════╗');
console.log('║      LLM Lab SIT/UAT Static Test Report  ║');
console.log('╚══════════════════════════════════════════╝\n');

const passed = results.filter((r) => r.pass);
const failed = results.filter((r) => !r.pass);

console.log('PASSED (' + passed.length + '):');
passed.forEach((r) => console.log('  ✅ ' + r.desc));

if (failed.length > 0) {
  console.log('\nFAILED (' + failed.length + '):');
  failed.forEach((r) => console.log('  ❌ ' + r.desc + (r.detail ? ': ' + r.detail : '')));
}

console.log('\n─────────────────────────────────────────');
console.log('Total: ' + passed.length + ' PASS / ' + failed.length + ' FAIL out of ' + results.length + ' tests');
if (failed.length === 0) {
  console.log('\n🎉 ALL TESTS PASSED — Application ready for production!');
} else {
  console.log('\n⚠️  Fix ' + failed.length + ' issue(s) before production deploy.');
  process.exit(1);
}
