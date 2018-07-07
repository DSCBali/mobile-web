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
