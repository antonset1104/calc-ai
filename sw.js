/*
 * BenchLM serves editorial figures that can be corrected at any time.
 * Clear the old offline caches and let the browser fetch current files directly.
 */
const VERSION = 'llmlab-v5';

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('llmlab-')).map((key) => caches.delete(key)));
    await caches.open(VERSION);
    await self.clients.claim();
  })());
});
