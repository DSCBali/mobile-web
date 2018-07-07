var staticCacheName = 'wittr-static-v1';

self.addEventListener('install', function(event) {
  var urlsToCache = [
    '/',
    'assets/css/materialize.min.css',
    'assets/css/styles.css',
    'assets/js/materialize.min.js',
    'assets/js/idb.js',
    'assets/js/dbHelper.js',
    'assets/js/es6app.js'
  ];

  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return (
              cacheName.startsWith('wittr-') && cacheName !== staticCacheName
            );
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(function(response) {
        if (response) return response;
        return fetch(event.request).catch(function() {
          return new Response('Offline');
        });
      })
      .catch(() => {
        console.log('FAILED ON CACHES');
      })
  );
  // Coba simulasi offline dan lihat hasilnya
});
