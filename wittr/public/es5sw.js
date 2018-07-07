var staticCacheName = 'wittr-static-v2';
var contentImgsCache = 'wittr-content-imgs';
var allCaches = [staticCacheName, contentImgsCache];

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
              cacheName.startsWith('wittr-') && !allCaches.includes(cacheName)
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
  var requestUrl = new URL(event.request.url);
  if (requestUrl.pathname.startsWith('/photos/')) {
    event.respondWith(servePhoto(event.request));
    return;
  }

  if (requestUrl.pathname.startsWith('/avatars/')) {
    event.respondWith(serveAvatar(event.request));
    return;
  }

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

function servePhoto(request) {
  var storageUrl = request.url.replace(/-\d+px\.jpg$/, '');

  return caches.open(contentImgsCache).then(function(cache) {
    return cache.match(storageUrl).then(function(response) {
      if (response) return response;

      return fetch(request).then(function(networkResponse) {
        cache.put(storageUrl, networkResponse.clone());
        // .clone() karena hanya bisa membaca body dari response sekali
        return networkResponse; // kembalikan response ke browser
      });
    });
  });
}

function serveAvatar(request) {
  var storageUrl = request.url.replace(/-\dx\.jpg$/, '');

  return caches.open(contentImgsCache).then(function(cache) {
    return cache.match(storageUrl).then(function(response) {
      var networkFetch = fetch(request).then(function(networkResponse) {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });

      return response || networkFetch;
    });
  });
}

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
