const CACHE_NAME = 'kc-app-v2';
const urlsToCache = [
  './index_kc.html',
  './dashboard_kc.html',
  './logo_kc.png',
  './sore.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// PENGAMANAN BARU: HANYA HAPUS CACHE KC LAMA, JANGAN SENTUH CACHE MLU!
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Kalau depannya "kc-app-" dan bukan versi sekarang, baru hapus. 
          // Kalau namanya punya MLU, biarin aja!
          if (cacheName.startsWith('kc-app-') && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
