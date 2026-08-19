/* ============================================================
   sw.js — service worker minimal
   Navigasi: network-first (agar pembaruan cepat terlihat).
   Aset statis: stale-while-revalidate.
   ============================================================ */

const VERSION = 'llmlab-v2';
const CORE = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/config.js',
  './js/lib/charts.js',
  './js/lib/i18n.js',
  './js/lib/model.js',
  './js/lib/monetize.js',
  './js/lib/sampling.js',
  './js/lib/seo.js',
  './js/lib/tokenizer.js',
  './js/lib/ui.js',
  './js/data/glossary.js',
  './js/data/leaderboard.js',
  './js/data/models.js',
  './js/views/benchmarks.js',
  './js/views/compare.js',
  './js/views/context.js',
  './js/views/glossary.js',
  './js/views/leaderboard.js',
  './js/views/prompting.js',
  './js/views/selector.js',
  './js/views/simulator.js',
  './js/views/tokenizer.js',
  './assets/icon.svg',
  './manifest.json',
  './sitemap.xml',
  './robots.txt',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;

  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((res) => {
          caches.open(VERSION).then((c) => c.put(request, res.clone()));
          return res;
        })
        .catch(() => caches.match('./index.html').then((r) => r || Response.error())),
    );
    return;
  }

  e.respondWith(
    caches.match(request).then((hit) => {
      const net = fetch(request)
        .then((res) => {
          if (res.ok) caches.open(VERSION).then((c) => c.put(request, res.clone()));
          return res;
        })
        .catch(() => hit);
      return hit || net;
    }),
  );
});
