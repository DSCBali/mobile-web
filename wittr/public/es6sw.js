const staticCacheName = 'wittr-static-v1';

self.addEventListener('install', event => {
  const urlsToCache = [
    '/',
    'assets/css/materialize.min.css',
    'assets/css/styles.css',
    'assets/js/materialize.min.js',
    'assets/js/idb.js',
    'assets/js/dbHelper.js',
    'assets/js/es6app.js'
  ];

  event.waitUntil(
    caches.open(staticCacheName).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(
              cacheName =>
                cacheName.startsWith('wittr-') && cacheName !== staticCacheName
            )
            .map(cacheName => caches.delete(cacheName))
        )
      )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request).catch(() => {
          return new Response('Offline');
        });
      })
      .catch(() => {
        console.log('FAILED ON CACHES');
      })
  );
  // Coba simulasi offline dan lihat hasilnya
});

self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
