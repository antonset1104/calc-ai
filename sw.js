/* ============================================================
   sw.js — service worker minimal
   Navigasi: network-first (agar pembaruan cepat terlihat).
   Aset statis: stale-while-revalidate.
   ============================================================ */

const VERSION = 'llmlab-v1';
const CORE = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/lib/ui.js',
  './js/lib/tokenizer.js',
  './js/lib/sampling.js',
  './js/lib/model.js',
  './js/data/models.js',
  './js/data/glossary.js',
  './js/views/simulator.js',
  './js/views/tokenizer.js',
  './js/views/context.js',
  './js/views/prompting.js',
  './js/views/glossary.js',
  './assets/icon.svg',
  './manifest.json',
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
