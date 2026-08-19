/* ============================================================
   ui.js — utilitas DOM kecil (pengganti framework)
   ============================================================ */

/** el('div.card', {id:'x'}, [child, 'teks']) */
export function el(spec, attrs = {}, kids = []) {
  const [tagPart, ...classes] = String(spec).split('.');
  const node = document.createElement(tagPart || 'div');
  if (classes.length) node.className = classes.join(' ');
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className += (node.className ? ' ' : '') + v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  append(node, kids);
  return node;
}

/** Tambahkan anak: array bersarang diratakan, null/false diabaikan. */
export function append(node, kids) {
  (Array.isArray(kids) ? kids : [kids]).forEach((c) => {
    if (c == null || c === false) return;
    if (Array.isArray(c)) return append(node, c);
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  });
}

export const frag = (kids = []) => {
  const f = document.createDocumentFragment();
  kids.filter(Boolean).forEach((k) => f.append(k instanceof Node ? k : document.createTextNode(String(k))));
  return f;
};

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- angka ---------- */
export const nf = (n, d = 0) => new Intl.NumberFormat(document.documentElement.lang === 'en' ? 'en-US' : 'id-ID',
  { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);

export function compact(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1) + 'K';
  return String(n);
}

export function usd(v) {
  if (v === 0) return '$0';
  if (v < 0.01) return '$' + v.toFixed(5);
  if (v < 1) return '$' + v.toFixed(4);
  if (v < 100) return '$' + v.toFixed(2);
  return '$' + nf(Math.round(v));
}

/* ---------- interaksi ---------- */
export function debounce(fn, ms = 140) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

let toastTimer;
export function toast(msg) {
  const box = document.getElementById('toast');
  if (!box) return;
  box.textContent = msg;
  box.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove('on'), 2200);
}

export async function copy(text, okMsg = 'Tersalin') {
  try {
    await navigator.clipboard.writeText(text);
    toast(okMsg);
    return true;
  } catch {
    const ta = el('textarea', { style: { position: 'fixed', opacity: '0' } });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand?.('copy');
    ta.remove();
    toast(ok ? okMsg : 'Gagal menyalin');
    return !!ok;
  }
}

/* ---------- komponen kecil yang dipakai berulang ---------- */

export function card(title, kids, opts = {}) {
  const head = title
    ? el('div.card-head', {}, [
        el(opts.h3 ? 'h3' : 'h2', {}, [title]),
        opts.aside || null,
      ])
    : null;
  return el('section.card' + (opts.cls ? '.' + opts.cls : ''), opts.attrs || {}, [
    head,
    opts.sub ? el('p.card-sub', { text: opts.sub }) : null,
    ...(Array.isArray(kids) ? kids : [kids]),
  ]);
}

export function stat(k, v, sub) {
  return el('div.stat', {}, [
    el('span.stat-k', { text: k }),
    el('span.stat-v', {}, [v, sub ? el('small', { text: ' ' + sub }) : null]),
  ]);
}

export function meter(pct, danger = false) {
  return el('div.meter' + (danger ? '.meter-danger' : ''), { role: 'presentation' }, [
    el('i', { style: { width: Math.max(0, Math.min(100, pct)) + '%' } }),
  ]);
}

export function slider({ label, hint, min, max, step, value, fmt = (v) => v, onInput }) {
  const out = el('span.param-val', { text: fmt(value) });
  const input = el('input', {
    type: 'range', min, max, step, value,
    oninput: (e) => { const v = parseFloat(e.target.value); out.textContent = fmt(v); onInput(v); },
  });
  return el('div.param', {}, [
    el('div.param-top', {}, [el('label', {}, [label]), out]),
    input,
    hint ? el('span.param-hint', { text: hint }) : null,
  ]);
}

export function segmented(items, active, onPick, aria = '') {
  const box = el('div.seg', { role: 'group', 'aria-label': aria });
  items.forEach((it) => {
    box.append(el('button', {
      type: 'button',
      'aria-pressed': it.id === active ? 'true' : 'false',
      onclick: () => {
        [...box.children].forEach((b) => b.setAttribute('aria-pressed', 'false'));
        box.querySelector(`[data-id="${it.id}"]`)?.setAttribute('aria-pressed', 'true');
        onPick(it.id);
      },
      dataset: { id: it.id },
    }, [it.label]));
  });
  return box;
}

export function copyBtn(getText, label = 'Salin') {
  return el('button.btn.btn-sm', {
    type: 'button',
    onclick: () => copy(getText(), label === 'Copy' ? 'Copied' : 'Tersalin'),
  }, [
    el('span', { html: '<svg viewBox="0 0 20 20" aria-hidden="true" style="width:14px;height:14px"><rect x="6.5" y="6.5" width="9" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M13 4H5.5A1.5 1.5 0 0 0 4 5.5V14" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>' }),
    label,
  ]);
}
