/* ============================================================
   views/glossary.js — Glosarium istilah AI/LLM (dua bahasa)
   ============================================================ */

import { el, card, debounce, nf } from '../lib/ui.js';
import { GLOSSARY, CATEGORIES } from '../data/glossary.js';

export const meta = { title: { id: 'Glosarium', en: 'Glossary' } };

const S = {
  id: {
    h1: 'Glosarium: istilah AI tanpa jargon berlapis',
    lead: 'Setiap istilah dijelaskan dalam satu kalimat yang bisa Anda pakai di rapat. Cari, saring per kategori, atau tautkan langsung ke satu istilah.',
    search: 'Cari istilah atau definisi…',
    count: (n, total) => `${nf(n)} dari ${nf(total)} istilah`,
    sortAZ: 'A–Z', sortCat: 'Per kategori',
    empty: 'Tidak ada istilah yang cocok. Coba kata kunci lain.',
    clear: 'Hapus pencarian',
    tip: 'Tip: tekan Ctrl+K di mana saja untuk mencari istilah dari halaman lain.',
  },
  en: {
    h1: 'Glossary: AI terms without layered jargon',
    lead: 'Every term is explained in one sentence you can actually use in a meeting. Search, filter by category, or deep-link to a single term.',
    search: 'Search terms or definitions…',
    count: (n, total) => `${nf(n)} of ${nf(total)} terms`,
    sortAZ: 'A–Z', sortCat: 'By category',
    empty: 'No matching terms. Try another keyword.',
    clear: 'Clear search',
    tip: 'Tip: press Ctrl+K anywhere to search terms from another page.',
  },
  es: {
    h1: 'Glosario: términos de IA sin jerga por capas',
    lead: 'Cada término se explica en una oración que puede usar en una reunión.',
    search: 'Buscar términos o definiciones…',
    count: (n, total) => n + ' de ' + total + ' términos',
    sortAZ: 'A–Z', sortCat: 'Por categoría',
    empty: 'Sin términos coincidentes. Intente con otra palabra.',
    clear: 'Limpiar búsqueda',
    tip: 'Consejo: presione Ctrl+K en cualquier lugar para buscar términos.',
  },
  zh: {
    h1: '术语表：去除层层行话的 AI 术语',
    lead: '每个术语用一句话解释，你可以直接在会议中使用。',
    search: '搜索术语或定义…',
    count: (n, total) => '共 ' + total + ' 个术语，显示 ' + n + ' 个',
    sortAZ: 'A–Z', sortCat: '按类别',
    empty: '没有匹配的术语，请尝试其他关键词。',
    clear: '清除搜索',
    tip: '提示：在任意页面按 Ctrl+K 可搜索术语。',
  },
  ja: {
    h1: 'グロッサリー：重ねた専門用語なしのAI用語',
    lead: '各用語は、会議で実際に使える一文で説明されています。',
    search: '用語または定義を検索…',
    count: (n, total) => total + '件中' + n + '件表示',
    sortAZ: 'A–Z', sortCat: 'カテゴリ別',
    empty: '一致する用語がありません。別のキーワードをお試しください。',
    clear: '検索をクリア',
    tip: 'ヒント：どこからでもCtrl+Kを押して用語を検索できます。',
  },
  fr: {
    h1: "Glossaire : termes IA sans jargon superpose",
    lead: "Chaque terme est explique en une phrase que vous pouvez utiliser en reunion.",
    search: "Rechercher des termes ou des definitions...",
    count: (n, total) => n + " sur " + total + " termes",
    sortAZ: "A–Z", sortCat: "Par categorie",
    empty: "Aucun terme correspondant. Essayez un autre mot-cle.",
    clear: "Effacer la recherche",
    tip: "Astuce : appuyez sur Ctrl+K n'importe ou pour rechercher des termes.",
  },
  de: {
    h1: 'Glossar: KI-Begriffe ohne aufgehäuften Jargon',
    lead: 'Jeder Begriff wird in einem Satz erklärt, den Sie tatsächlich in einem Meeting verwenden können.',
    search: 'Begriffe oder Definitionen suchen…',
    count: (n, total) => n + ' von ' + total + ' Begriffen',
    sortAZ: 'A–Z', sortCat: 'Nach Kategorie',
    empty: 'Keine übereinstimmenden Begriffe. Versuchen Sie ein anderes Schlüsselwort.',
    clear: 'Suche löschen',
    tip: 'Tipp: Drücken Sie überall Ctrl+K, um nach Begriffen zu suchen.',
  },
  ar: {
    h1: 'المسرد: مصطلحات الذكاء الاصطناعي بدون مصطلحات تقنية معقدة',
    lead: 'كل مصطلح يُشرح في جملة واحدة يمكنك استخدامها في اجتماع.',
    search: 'البحث في المصطلحات أو التعريفات…',
    count: (n, total) => n + ' من ' + total + ' مصطلح',
    sortAZ: 'أ–ي', sortCat: 'حسب الفئة',
    empty: 'لا توجد مصطلحات مطابقة. جرب كلمة أخرى.',
    clear: 'مسح البحث',
    tip: 'نصيحة: اضغط Ctrl+K في أي مكان للبحث عن المصطلحات.',
  },
  pt: {
    h1: 'Glossário: termos de IA sem jargão em camadas',
    lead: 'Cada termo é explicado em uma frase que você pode usar em uma reunião.',
    search: 'Pesquisar termos ou definições…',
    count: (n, total) => n + ' de ' + total + ' termos',
    sortAZ: 'A–Z', sortCat: 'Por categoria',
    empty: 'Nenhum termo correspondente. Tente outra palavra-chave.',
    clear: 'Limpar pesquisa',
    tip: 'Dica: pressione Ctrl+K em qualquer lugar para pesquisar termos.',
  },
  ru: {
    h1: 'Глоссарий: термины ИИ без нагромождения жаргона',
    lead: 'Каждый термин объясняется одним предложением, которое можно использовать на совещании.',
    search: 'Поиск терминов или определений…',
    count: (n, total) => n + ' из ' + total + ' терминов',
    sortAZ: 'А–Я', sortCat: 'По категории',
    empty: 'Нет совпадающих терминов. Попробуйте другое ключевое слово.',
    clear: 'Очистить поиск',
    tip: 'Подсказка: нажмите Ctrl+K в любом месте для поиска терминов.',
  },
  ko: {
    h1: '용어집: 중첩된 전문 용어 없는 AI 용어',
    lead: '각 용어는 회의에서 실제로 사용할 수 있는 한 문장으로 설명됩니다.',
    search: '용어 또는 정의 검색…',
    count: (n, total) => total + '개 중 ' + n + '개 표시',
    sortAZ: 'A–Z', sortCat: '카테고리별',
    empty: '일치하는 용어가 없습니다. 다른 키워드를 시도해보세요.',
    clear: '검색 초기화',
    tip: '팁: 어디서든 Ctrl+K를 눌러 용어를 검색하세요.',
  },
};

const label = (c, lang) => (lang === 'en' ? c.en_label : c.id_label);

function highlight(text, q) {
  if (!q) return document.createTextNode(text);
  const f = document.createDocumentFragment();
  const lower = text.toLowerCase();
  let i = 0;
  while (i < text.length) {
    const at = lower.indexOf(q, i);
    if (at === -1) { f.append(text.slice(i)); break; }
    if (at > i) f.append(text.slice(i, at));
    f.append(el('mark', { text: text.slice(at, at + q.length) }));
    i = at + q.length;
  }
  return f;
}

export function render(root, ctx) {
  const t = S[ctx.lang] || S.en || S.id;
  const lang = ctx.lang === 'id' ? 'id' : 'en';
  let q = (ctx.params.get('q') || '').toLowerCase();
  let cat = 'all';
  let sort = 'cat';

  const input = el('input', { type: 'search', value: q, placeholder: t.search, 'aria-label': t.search, spellcheck: 'false' });
  input.addEventListener('input', debounce(() => { q = input.value.trim().toLowerCase(); paint(); }, 110));

  const countBadge = el('span.badge.badge-accent');
  const catRow = el('div.chips', {}, CATEGORIES.map((c) =>
    el('button.chip', {
      type: 'button', 'aria-pressed': c.id === cat ? 'true' : 'false', dataset: { c: c.id },
      onclick: () => {
        cat = c.id;
        [...catRow.children].forEach((n) => n.setAttribute('aria-pressed', n.dataset.c === cat ? 'true' : 'false'));
        paint();
      },
    }, [label(c, lang)])));

  const sortRow = el('div.seg', { role: 'group', 'aria-label': 'sort' }, [
    el('button', { type: 'button', 'aria-pressed': 'false', dataset: { s: 'az' }, onclick: () => setSort('az') }, [t.sortAZ]),
    el('button', { type: 'button', 'aria-pressed': 'true', dataset: { s: 'cat' }, onclick: () => setSort('cat') }, [t.sortCat]),
  ]);
  function setSort(s) {
    sort = s;
    [...sortRow.children].forEach((b) => b.setAttribute('aria-pressed', b.dataset.s === s ? 'true' : 'false'));
    paint();
  }

  const list = el('div.gloss');

  root.append(
    el('header.head', {}, [
      el('span.eyebrow', { text: ctx.lang === 'id' ? 'Glosarium' : 'Glossary' }),
      el('h1', { text: t.h1 }),
      el('p', { text: t.lead }),
    ]),
    card(null, [
      el('div.stack', {}, [
        input,
        el('div.row-between', {}, [catRow, el('div.row', {}, [countBadge, sortRow])]),
      ]),
    ], { cls: 'card-tight' }),
    el('div', { style: { marginTop: '14px' } }, [list]),
    el('p.card-sub', { text: t.tip, style: { marginTop: '16px' } }),
  );

  function paint() {
    const items = GLOSSARY.filter((g) => {
      if (cat !== 'all' && g.c !== cat) return false;
      if (!q) return true;
      return (g.t + ' ' + (g.alias || '') + ' ' + g[lang]).toLowerCase().includes(q);
    });

    if (sort === 'az') items.sort((a, b) => a.t.localeCompare(b.t));
    else items.sort((a, b) => (CATEGORIES.findIndex((c) => c.id === a.c) - CATEGORIES.findIndex((c) => c.id === b.c)) || a.t.localeCompare(b.t));

    countBadge.textContent = t.count(items.length, GLOSSARY.length);
    list.textContent = '';

    if (!items.length) {
      list.append(el('p.empty', { text: t.empty }));
      return;
    }

    const f = document.createDocumentFragment();
    let lastCat = null;
    items.forEach((g) => {
      if (sort === 'cat' && g.c !== lastCat) {
        lastCat = g.c;
        const c = CATEGORIES.find((x) => x.id === g.c);
        f.append(el('h2', { text: label(c, lang), style: { marginTop: '10px', fontSize: '1.02rem', color: 'var(--text-dim)' } }));
      }
      const body = el('p');
      body.append(highlight(g[lang], q));
      f.append(el('article.term', {}, [
        el('h3', {}, [
          highlight(g.t, q),
          g.alias ? el('span.alias', { text: g.alias }) : null,
          el('span.badge', { text: label(CATEGORIES.find((x) => x.id === g.c), lang) }),
        ]),
        body,
      ]));
    });
    list.append(f);
  }

  paint();
  if (!q) requestAnimationFrame(() => input.focus({ preventScroll: true }));
}
