var staticCacheName = 'wittr-static-v2';

self.addEventListener('install', function(event) {
  var urlsToCache = [
    '/',
    '/chats',
    'assets/css/materialize.min.css',
    'assets/css/styles.css',
    'assets/js/materialize.min.js',
    'assets/js/dbHelper.js',
    'assets/js/es6app.js'
  ];

  // waitUntil menyuruh SW untuk tunggu hingga proses selesai
  event.waitUntil(
    caches.open('wittr-static-v1').then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
  // event.waitUntil(
  //   caches.open('wittr-static-v2').then(function(cache) {
  //     return cache.addAll(urlsToCache);
  //   })
  // );
  // event.waitUntil(
  //   caches.open(staticCacheName).then(function(cache) {
  //     return cache.addAll(urlsToCache);
  //   })
  // );
});

self.addEventListener('activate', event => {
  // TODO: Ganti warna toolbar di styles.css
  // TODO: Ganti versi cache ke v2
  // TODO: Hapus versi cache v1
  // event.waitUntil(caches.delete('wittr-static-v1'));
  // event.waitUntil(
  //   caches.keys().then(function(cacheNames) {
  //     return Promise.all(
  //       cacheNames
  //         .filter(function(cacheName) {
  //           return (
  //             cacheName.startsWith('wittr-') && cacheName !== staticCacheName
  //           );
  //         })
  //         .map(function(cacheName) {
  //           return caches.delete(cacheName);
  //         })
  //     );
  //   })
  // );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) return response;
      return fetch(event.request);
      // return response || fetch(event.request);
    })
  );
  // Coba simulasi offline dan lihat hasilnya
});
