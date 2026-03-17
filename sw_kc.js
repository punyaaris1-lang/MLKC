// Ganti nama cache biar fresh di GitHub
const CACHE_NAME = 'kc-app-github-v1';

// Pakai ./ (titik slash) biar aman di GitHub Pages
const urlsToCache = [
  './index_kc.html',
  './dashboard_kc.html',
  './logo_kc.png',
  './sore.png'
];

// Install & Simpan Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache KC GitHub Berhasil Dibuat');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Panggil dari Cache kalau Offline / Lemot
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      return fetch(event.request);
    })
  );
});

// Hapus Cache KC yang lama (Aman, ga nyentuh MLU)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('kc-app-') && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
