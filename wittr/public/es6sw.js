const staticCacheName = 'wittr-static-v2';
const contentImgsCache = 'wittr-content-imgs';
const allCaches = [staticCacheName, contentImgsCache];

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
                cacheName.startsWith('wittr-') && !allCaches.includes(cacheName)
            )
            .map(cacheName => caches.delete(cacheName))
        )
      )
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
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

const serveAvatar = request => {
  const storageUrl = request.url.replace(/-\dx\.jpg$/, '');

  return caches.open(contentImgsCache).then(cache => {
    return cache.match(storageUrl).then(response => {
      const networkFetch = fetch(request).then(networkResponse => {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });

      return response || networkFetch;
    });
  });
};

const servePhoto = request => {
  const storageUrl = request.url.replace(/-\d+px\.jpg$/, '');

  return caches.open(contentImgsCache).then(cache => {
    return cache.match(storageUrl).then(response => {
      if (response) return response;

      return fetch(request).then(networkResponse => {
        cache.put(storageUrl, networkResponse.clone());
        // .clone() karena hanya bisa membaca body dari response sekali
        return networkResponse; // kembalikan response ke browser
      });
    });
  });
};

self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('sync', event => {
  console.log('sync event');
  console.log(event);
  self.registration.showNotification('New Notification');
});
