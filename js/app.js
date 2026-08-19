import { el, toast, autoLabel } from './lib/ui.js';
import { updateSEO } from './lib/seo.js';
import { openRadarModal, openAdvisoryModal } from './lib/monetize.js';
import { SUPPORTED_LANGUAGES, SHELL_TRANSLATIONS, t } from './lib/i18n.js';
import { DATA_STATUS, DATA_ROUTES, DATA_NOTICE, DATA_NOTICE_TITLE, DATA_SNAPSHOT, LEADGEN, CONTACT, SPONSOR_URL } from './config.js';

/* ---------- rute & ikon ---------- */
const ICON = {
  leaderboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 9H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m12 5h3a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-3M6 4h12v7a6 6 0 0 1-12 0V4Zm3 14h6m-3-3v3m-4 3h8"/></svg>',
  compare:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',
  selector:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="m14.5 9.5-5 5m0-5 5 5M12 3v2m0 14v2M3 12h2m14 0h2"/></svg>',
  benchmarks:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10M6 14h6"/></svg>',
  simulator:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 18V7m0 11h5M20 7v11m0-11h-5"/><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/></svg>',
  tokenizer:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3" y="6" width="6" height="5" rx="1.6"/><rect x="11" y="6" width="10" height="5" rx="1.6"/><rect x="3" y="14" width="10" height="5" rx="1.6"/><rect x="15" y="14" width="6" height="5" rx="1.6"/></svg>',
  context:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 12h9"/><path d="M12 5v14"/></svg>',
  prompting:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M5 6h14M5 11h9M5 16h5"/><path d="M16.5 14.5 19 17l-2.5 2.5"/></svg>',
  glossary:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z"/><path d="M17 20a2 2 0 0 0 2-2V7"/><path d="M8 8h6M8 12h6"/></svg>',
};

const ROUTES = [
  {
    id: 'leaderboard',
    label: {
      id: 'Leaderboard', en: 'Leaderboard', es: 'Clasificación', zh: '天梯榜',
      ja: '順位表', fr: 'Classement', de: 'Rangliste', ar: 'لوحة الصدارة',
      pt: 'Classificação', ru: 'Рейтинг', ko: '리더보드',
    },
    load: () => import('./views/leaderboard.js'),
  },
  {
    id: 'compare',
    label: {
      id: 'Bandingkan', en: 'Compare', es: 'Comparar', zh: '模型对比',
      ja: 'モデル比較', fr: 'Comparer', de: 'Vergleichen', ar: 'مقارنة',
      pt: 'Comparar', ru: 'Сравнение', ko: '모델 비교',
    },
    load: () => import('./views/compare.js'),
  },
  {
    id: 'selector',
    label: {
      id: 'Pilih Model', en: 'Selector', es: 'Selector', zh: '智能选型',
      ja: 'モデル選定', fr: 'Sélecteur', de: 'Auswahl', ar: 'محدد النماذج',
      pt: 'Seletor', ru: 'Подбор', ko: '스마트 선택',
    },
    load: () => import('./views/selector.js'),
  },
  {
    id: 'benchmarks',
    label: {
      id: 'Benchmark', en: 'Benchmarks', es: 'Benchmarks', zh: '基准测试',
      ja: 'ベンチマーク', fr: 'Benchmarks', de: 'Benchmarks', ar: 'المقاييس',
      pt: 'Benchmarks', ru: 'Бенчмарки', ko: '벤치마크',
    },
    load: () => import('./views/benchmarks.js'),
  },
  {
    id: 'simulator',
    label: {
      id: 'Simulator', en: 'Simulator', es: 'Simulador', zh: '采样模拟',
      ja: 'シミュレータ', fr: 'Simulateur', de: 'Simulator', ar: 'المحاكي',
      pt: 'Simulador', ru: 'Симулятор', ko: '시뮬레이터',
    },
    load: () => import('./views/simulator.js'),
  },
  {
    id: 'tokenizer',
    label: {
      id: 'Tokenizer', en: 'Tokenizer', es: 'Tokenizador', zh: '分词计算',
      ja: 'トークナイザー', fr: 'Tokeniseur', de: 'Tokenizer', ar: 'أداة الترميز',
      pt: 'Tokenizador', ru: 'Токенизатор', ko: '토크나이저',
    },
    load: () => import('./views/tokenizer.js'),
  },
  {
    id: 'context',
    label: {
      id: 'Konteks', en: 'Context', es: 'Contexto', zh: '上下文窗口',
      ja: 'コンテキスト', fr: 'Contexte', de: 'Kontext', ar: 'سياق النص',
      pt: 'Contexto', ru: 'Контекст', ko: '컨텍스트',
    },
    load: () => import('./views/context.js'),
  },
  {
    id: 'prompting',
    label: {
      id: 'Prompting', en: 'Prompting', es: 'Prompting', zh: '提示词工程',
      ja: 'プロンプト', fr: 'Prompting', de: 'Prompting', ar: 'هندسة الأوامر',
      pt: 'Prompting', ru: 'Промптинг', ko: '프롬프팅',
    },
    load: () => import('./views/prompting.js'),
  },
  {
    id: 'glossary',
    label: {
      id: 'Glosarium', en: 'Glossary', es: 'Glosario', zh: '术语表',
      ja: '用語集', fr: 'Glossaire', de: 'Glossar', ar: 'المسرد',
      pt: 'Glossário', ru: 'Глоссарий', ko: '용어 사전',
    },
    load: () => import('./views/glossary.js'),
  },
];

/* ---------- state ---------- */
const store = {
  lang: 'id',
  theme: 'dark',
};

function readPrefs() {
  const validCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
  const urlLang = new URLSearchParams(location.search).get('lang');
  const saved = localStorage.getItem('llmlab.lang');
  if (urlLang && validCodes.includes(urlLang)) {
    store.lang = urlLang;
  } else if (saved && validCodes.includes(saved)) {
    store.lang = saved;
  } else {
    // Browser language detection
    const browserLang = (navigator.language || 'id').slice(0, 2).toLowerCase();
    store.lang = validCodes.includes(browserLang) ? browserLang : 'id';
  }
  const savedTheme = localStorage.getItem('llmlab.theme');
  store.theme = savedTheme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
}

function applyTheme() {
  document.documentElement.dataset.theme = store.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', store.theme === 'light' ? '#f6f7fb' : '#0a0c11');
  localStorage.setItem('llmlab.theme', store.theme);
}

function applyLang() {
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === store.lang) || SUPPORTED_LANGUAGES[0];
  document.documentElement.lang = store.lang;
  document.documentElement.dir = currentLangObj.dir || 'ltr';
  localStorage.setItem('llmlab.lang', store.lang);

  // Update Topbar button
  const flagEl = document.getElementById('currentLangFlag');
  const codeEl = document.getElementById('currentLangCode');
  if (flagEl) flagEl.textContent = currentLangObj.flag;
  if (codeEl) codeEl.textContent = currentLangObj.short;

  const s = SHELL_TRANSLATIONS[store.lang] || SHELL_TRANSLATIONS.en || SHELL_TRANSLATIONS.id;
  document.querySelectorAll('[data-i18n]').forEach((n) => {
    const k = n.dataset.i18n;
    if (s[k]) n.textContent = s[k];
  });
  document.getElementById('paletteInput')?.setAttribute('placeholder', s.placeholder);
  document.getElementById('themeBtn')?.setAttribute('aria-label', s.themeLabel);

  buildNav();
  buildLangModal();
  stampFooterStatus();
}

/**
 * Menempelkan status data pada footer supaya klaim "evaluasi independen"
 * tidak berdiri sendiri saat angka masih ilustratif.
 */
function stampFooterStatus() {
  const foot = document.querySelector('.foot-note');
  if (!foot) return;
  let badge = document.getElementById('dataStatusBadge');
  if (DATA_STATUS === 'sourced') { badge?.remove(); return; }
  if (!badge) {
    badge = el('span.badge.badge-warn', { id: 'dataStatusBadge', style: { marginLeft: '8px' } });
    foot.append(' ', badge);
  }
  badge.textContent = '⚠️ ' + t(DATA_NOTICE_TITLE.illustrative, store.lang);
}

function switchLanguage(code) {
  if (store.lang === code) return;
  store.lang = code;
  applyLang();
  
  // Update URL param without refreshing
  const url = new URL(window.location.href);
  url.searchParams.set('lang', code);
  window.history.replaceState({}, '', url.toString());

  // Close modal if open
  document.getElementById('langModal')?.close();
  
  // Re-render current view
  renderRoute();
  toast(`🌐 Language changed to ${SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name}`);
}

/* ---------- Language Modal Builder ---------- */
function buildLangModal() {
  const grid = document.getElementById('langGrid');
  if (!grid) return;
  grid.textContent = '';

  SUPPORTED_LANGUAGES.forEach((langItem) => {
    const isAct = langItem.code === store.lang;
    const btn = el('button.lang-btn', {
      type: 'button',
      class: isAct ? 'active' : '',
      onclick: () => switchLanguage(langItem.code),
    }, [
      el('span.flag', { text: langItem.flag }),
      el('span.name', { text: langItem.name }),
      el('span.badge-code', { text: langItem.short }),
    ]);
    grid.appendChild(btn);
  });
}

/* ---------- navigasi ---------- */
function buildNav() {
  const nav = document.getElementById('nav');
  const tab = document.getElementById('tabbar');
  if (!nav || !tab) return;
  nav.textContent = '';
  tab.textContent = '';

  ROUTES.forEach((r) => {
    const link = el('a', { href: '#/' + r.id, dataset: { route: r.id } }, [t(r.label, store.lang)]);
    link.addEventListener('click', (e) => {
      if (location.hash === '#/' + r.id) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderRoute();
      }
    });
    nav.append(link);
  });

  // Mobile Tabbar: tampilkan 5 rute utama
  const mobileTabRoutes = ['leaderboard', 'compare', 'selector', 'simulator', 'glossary'];
  ROUTES.filter((r) => mobileTabRoutes.includes(r.id)).forEach((r) => {
    const link = el('a', { href: '#/' + r.id, dataset: { route: r.id } }, [
      el('span', { html: ICON[r.id], 'aria-hidden': 'true' }),
      el('span', { text: t(r.label, store.lang) }),
    ]);
    link.addEventListener('click', (e) => {
      if (location.hash === '#/' + r.id) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderRoute();
      }
    });
    tab.append(link);
  });

  markActive(current().id);
}

function markActive(id) {
  document.querySelectorAll('[data-route]').forEach((a) => {
    if (a.dataset.route === id) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

function current() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, qs] = raw.split('?');
  const route = ROUTES.find((r) => r.id === path) || ROUTES[0];
  return { id: route.id, route, params: new URLSearchParams(qs || '') };
}

/* ---------- konteks yang diberikan ke tiap view ---------- */
function ctx() {
  return {
    lang: store.lang,
    params: current().params,
    go(hash) { location.hash = hash; },
    toast,
    onLangChange: null,
  };
}

/* ---------- router ---------- */
let destroyCurrent = null;
let renderToken = 0;

function skeleton() {
  return el('div.skeleton', {}, [
    el('div.sk', { style: { height: '38px', width: '46%' } }),
    el('div.sk', { style: { height: '18px', width: '68%' } }),
    el('div.sk', { style: { height: '220px' } }),
    el('div.sk', { style: { height: '160px' } }),
  ]);
}

/**
 * Menyisipkan status provenance data di atas halaman berbasis angka model.
 * Teks & status diatur di js/config.js (DATA_STATUS).
 */
function injectDataNotice(root, routeId) {
  if (!DATA_ROUTES.includes(routeId)) return;
  const status = DATA_STATUS === 'sourced' ? 'sourced' : 'illustrative';
  const title = t(DATA_NOTICE_TITLE[status], store.lang);
  const body = t(DATA_NOTICE[status], store.lang);
  const note = el('div.note' + (status === 'illustrative' ? '.note-warn' : ''), {
    role: status === 'illustrative' ? 'alert' : null,
    style: { marginBottom: '16px' },
  }, [
    el('span', { text: status === 'illustrative' ? '⚠️' : 'ℹ️', 'aria-hidden': 'true' }),
    el('span', {}, [
      el('strong', { text: title + ' · ' }),
      body,
      el('span', { text: ' (snapshot ' + DATA_SNAPSHOT + ')', style: { color: 'var(--text-mute)' } }),
    ]),
  ]);
  const head = root.querySelector('.head');
  if (head && head.nextSibling) root.insertBefore(note, head.nextSibling);
  else root.insertBefore(note, root.firstChild);
}

async function renderRoute() {
  const my = ++renderToken;
  const { id, route } = current();
  const bar = document.getElementById('loadbar');
  const view = document.getElementById('view');

  markActive(id);
  bar.className = 'topbar-progress on';

  if (destroyCurrent) { try { destroyCurrent(); } catch { /* noop */ } destroyCurrent = null; }
  view.textContent = '';
  view.append(skeleton());

  let mod;
  try {
    mod = await route.load();
  } catch (err) {
    view.textContent = '';
    view.append(el('div.card', {}, [el('p', { text: 'Gagal memuat modul: ' + err.message })]));
    bar.className = 'topbar-progress done';
    return;
  }
  if (my !== renderToken) return;

  view.textContent = '';
  const root = el('div.view');
  view.append(root);
  destroyCurrent = mod.render(root, ctx()) || null;
  injectDataNotice(root, id);
  autoLabel(root);   // pasangkan label tanpa "for" ke kontrolnya (aksesibilitas)

  updateSEO(id, store.lang);
  bar.className = 'topbar-progress done';
  if (!location.hash.includes('?')) window.scrollTo({ top: 0, behavior: 'auto' });
  requestAnimationFrame(() => root.querySelector('h1')?.setAttribute('tabindex', '-1'));
}

/* ---------- command palette ---------- */
let paletteItems = null;
let selIndex = 0;

async function buildPaletteItems() {
  if (paletteItems) return paletteItems;

  const s = SHELL_TRANSLATIONS[store.lang] || SHELL_TRANSLATIONS.en || SHELL_TRANSLATIONS.id;

  const base = ROUTES.map((r) => ({
    t: t(r.label, store.lang),
    d: '',
    kind: s.page,
    hash: '#/' + r.id,
  }));

  const tools = [
    { t: store.lang === 'id' ? 'Leaderboard Skor Model AI' : 'AI Model Benchmark Leaderboard', hash: '#/leaderboard' },
    { t: store.lang === 'id' ? 'Bandingkan Model (Radar Chart)' : 'Compare Models (Radar Chart)', hash: '#/compare' },
    { t: store.lang === 'id' ? 'Pencari Model Pintar (Selector)' : 'Smart Model Selector', hash: '#/selector' },
    { t: store.lang === 'id' ? 'Kurva Pareto Harga vs Kinerja' : 'Price vs Performance Pareto Curve', hash: '#/selector' },
    { t: store.lang === 'id' ? 'Direktori & Metodologi Benchmark' : 'Benchmark Directory & Methodology', hash: '#/benchmarks' },
    { t: store.lang === 'id' ? 'Kalkulator Biaya Token' : 'Token Cost Calculator', hash: '#/tokenizer?panel=cost' },
    { t: store.lang === 'id' ? 'Bandingkan Tiga Tokenizer' : 'Compare Three Tokenizers', hash: '#/tokenizer?panel=compare' },
    { t: store.lang === 'id' ? 'Simulasi Memori Percakapan' : 'Chat Memory Simulation', hash: '#/context?panel=window' },
    { t: store.lang === 'id' ? 'Penyusun Prompt RISEN' : 'RISEN Prompt Builder', hash: '#/prompting?panel=risen' },
  ].map((x) => ({ ...x, d: '', kind: s.tool }));

  let modelsList = [];
  let benchList = [];
  try {
    const { LEADERBOARD_MODELS, BENCHMARKS } = await import('./data/leaderboard.js');
    modelsList = LEADERBOARD_MODELS.map((m) => ({
      t: `${m.name} (${m.vendor})`,
      d: `Skor BenchLM: ${m.overall} | $${m.blend}/1M | ${m.architecture}`,
      kind: s.model,
      hash: '#/leaderboard?model=' + m.id,
    }));
    benchList = BENCHMARKS.map((b) => ({
      t: b.name,
      d: `${b.developer} — ${t(b.desc, store.lang)}`,
      kind: s.bench,
      hash: '#/benchmarks',
    }));
  } catch { /* leaderboard data optional */ }

  let terms = [];
  try {
    const { GLOSSARY } = await import('./data/glossary.js');
    terms = GLOSSARY.map((g) => ({
      t: g.t,
      d: (store.lang === 'id' ? g.id : g.en).slice(0, 90),
      kind: s.term,
      hash: '#/glossary?q=' + encodeURIComponent(g.t),
    }));
  } catch { /* glosarium opsional */ }

  paletteItems = [...base, ...tools, ...modelsList, ...benchList, ...terms];
  return paletteItems;
}

function renderPalette(q) {
  const list = document.getElementById('paletteList');
  const sh = SHELL_TRANSLATIONS[store.lang] || SHELL_TRANSLATIONS.en || SHELL_TRANSLATIONS.id;
  const items = (paletteItems || []).filter((it) => {
    if (!q) return it.kind !== sh.term;
    const s = (it.t + ' ' + it.d).toLowerCase();
    return s.includes(q);
  }).slice(0, 40);

  list.textContent = '';
  selIndex = 0;
  items.forEach((it, i) => {
    list.append(el('li', {
      role: 'option',
      'aria-selected': i === 0 ? 'true' : 'false',
      dataset: { hash: it.hash },
      onclick: () => activate(it.hash),
      onmousemove: () => select(i),
    }, [
      el('span.pl-t', { text: it.t }),
      it.d ? el('span.pl-d', { text: it.d }) : null,
      el('span.pl-k', { text: it.kind }),
    ]));
  });

  if (!items.length) {
    list.append(el('li', { 'aria-disabled': 'true' }, [
      el('span.pl-d', { text: store.lang === 'id' ? 'Tidak ada hasil.' : 'No results.' }),
    ]));
  }
}

function select(i) {
  const list = document.getElementById('paletteList');
  const opts = [...list.querySelectorAll('li[data-hash]')];
  if (!opts.length) return;
  selIndex = (i + opts.length) % opts.length;
  opts.forEach((o, n) => o.setAttribute('aria-selected', n === selIndex ? 'true' : 'false'));
  opts[selIndex].scrollIntoView({ block: 'nearest' });
}

function activate(hash) {
  document.getElementById('palette').close();
  location.hash = hash;
}

async function openPalette() {
  const dlg = document.getElementById('palette');
  const input = document.getElementById('paletteInput');
  await buildPaletteItems();
  renderPalette('');
  if (!dlg.open) dlg.showModal();
  input.value = '';
  input.focus();
}

/* ---------- boot ---------- */
function wire() {
  document.getElementById('themeBtn')?.addEventListener('click', () => {
    store.theme = store.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
  });

  // Language Picker Modal Trigger
  const langModal = document.getElementById('langModal');
  document.getElementById('langPickerBtn')?.addEventListener('click', () => {
    buildLangModal();
    if (!langModal.open) langModal.showModal();
  });
  document.getElementById('closeLangModal')?.addEventListener('click', () => {
    langModal.close();
  });
  langModal?.addEventListener('click', (e) => {
    if (e.target === langModal) langModal.close();
  });

  document.getElementById('paletteBtn').addEventListener('click', openPalette);
  document.getElementById('paletteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const sel = document.querySelector('#paletteList li[aria-selected="true"]');
    if (sel?.dataset.hash) activate(sel.dataset.hash);
  });
  document.getElementById('paletteInput').addEventListener('input', (e) => {
    renderPalette(e.target.value.trim().toLowerCase());
  });
  document.getElementById('palette').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); select(selIndex + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); select(selIndex - 1); }
  });
  document.getElementById('palette').addEventListener('click', (e) => {
    if (e.target.id === 'palette') e.target.close();
  });

  // Radar Signal Bar & Form
  // Formulir lead-gen hanya aktif kalau ada kanal nyata (lihat js/config.js).
  if (LEADGEN.newsletter) {
    document.getElementById('radarBtn')?.addEventListener('click', openRadarModal);
  } else {
    document.getElementById('signalBar')?.remove();
    document.getElementById('radarModal')?.remove();
  }
  if (!LEADGEN.advisory) {
    document.getElementById('footAdvisoryBtn')?.remove();
    document.getElementById('advisoryModal')?.remove();
  }
  if (!SPONSOR_URL) {
    document.querySelector('.foot a[href*="sponsors"]')?.remove();
  } else {
    const sp = document.querySelector('.foot a[href*="sponsors"]');
    if (sp) sp.href = SPONSOR_URL;
  }
  const rForm = document.getElementById('radarForm');
  if (rForm) {
    rForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('radarEmail')?.value;
      if (email) localStorage.setItem('radar_brief_email', email);
      document.getElementById('radarModal')?.close();
      toast(store.lang === 'id' ? 'Terima kasih! Anda telah terdaftar pada Radar AI Morning Brief.' : 'Thank you! You are now subscribed to the Radar AI Morning Brief.');
    });
  }

  // Enterprise Advisory Buttons & Form
  document.getElementById('footAdvisoryBtn')?.addEventListener('click', openAdvisoryModal);
  const aForm = document.getElementById('advisoryForm');
  if (aForm) {
    aForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('advisoryModal')?.close();
      toast(store.lang === 'id' ? 'Permintaan terkirim! Tim kami akan menghubungi Anda dalam 1x24 jam.' : 'Inquiry sent! Our team will get back to you within 24 hours.');
    });
  }

  // Tombol tutup modal (tanpa handler inline, supaya CSP bisa ketat)
  document.querySelectorAll('[data-close]').forEach((b) => {
    b.addEventListener('click', () => document.getElementById(b.dataset.close)?.close());
  });

  addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
      e.preventDefault(); openPalette();
    }
  });

  addEventListener('hashchange', renderRoute);
}

function prefetchRest() {
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
  idle(() => {
    const activeId = current().id;
    ROUTES.filter((r) => r.id !== activeId).forEach((r, i) => setTimeout(() => r.load().catch(() => {}), i * 180));
    import('./data/leaderboard.js').catch(() => {});
    import('./data/glossary.js').catch(() => {});
  });
}

readPrefs();
applyTheme();
if (!location.hash) history.replaceState(null, '', '#/leaderboard');
applyLang();
wire();
renderRoute().then(prefetchRest);

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
