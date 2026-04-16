const CACHE_NAME = 'kc-super-cache-v4'; // NANTI KALAU ADA UPDATE LAGI, GANTI JADI v3, v4, dst.

// Install langsung tanpa nunggu
self.addEventListener('install', (event) => {
    self.skipWaiting(); 
});

// Bersihkan Cache versi lama (Nuke)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Strategi "Network First" -> Selalu ambil dari GitHub dulu, kalau sinyal jelek baru pakai Cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => caches.match(event.request))
    );
});
