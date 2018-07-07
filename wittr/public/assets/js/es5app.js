document.addEventListener('DOMContentLoaded', function() {
  fillMessages();
  registerServiceWorker();
  cleanImageCaches();
});

function cleanImageCaches() {
  DBHelper.openDb().then(function(db) {
    if (!db) return;

    var imagesNeeded = [];
    var tx = db.transaction('wittrs');
    return tx
      .objectStore('wittrs')
      .getAll()
      .then(function(messages) {
        messages.forEach(function(message) {
          if (message.photo) {
            imagesNeeded.push(message.photo);
          }
          imagesNeeded.push(message.avatar);
        });

        return caches.open('wittr-content-imgs');
      })
      .then(function(cache) {
        return cache.keys().then(function(requests) {
          // console.log(requests);
          requests.forEach(function(request) {
            var url = new URL(request.url);
            if (!imagesNeeded.includes(url.pathname)) {
              cache.delete(request);
            }
          });
        });
      });
  });
}

var registerServiceWorker = function registerServiceWorker() {
  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/es5sw.js').then(function(reg) {
    // Jika tidak ada controller, page ini tidak di load dengan SW jadinya page ini ada di versi terbaru.
    if (!navigator.serviceWorker.controller) return;

    // Jika ada update sudah menunggu
    if (reg.waiting) {
      updateReady();
      return;
    }

    // Jika ada update lagi di install
    if (reg.installing) {
      trackInstalling(reg.installing);
      return;
    }

    reg.addEventListener('updatefound', function() {
      trackInstalling(reg.installing);
    });
  });
};

var updateReady = function updateReady() {
  var toastHTML =
    '<span>New version is available</span><button class="btn-flat toast-action">Refresh</button>';
  M.toast({ html: toastHTML, displayLength: 60000 });
};

var trackInstalling = function trackInstalling(worker) {
  worker.addEventListener('statechache', function() {
    if (worker.state === 'installed') {
      updateReady();
    }
  });
};

function fillMessages() {
  DBHelper.fetchMessages().then(function(messages) {
    const chatLists = document.getElementById('chat-lists');
    console.log(messages);

    messages.forEach(function(chat) {
      createList(chatLists, chat);
    });
  });
}

/**
 * Hiraukan code di bawah ini
 */

function createList(chatLists, chat) {
  var card = document.createElement('div');
  card.classList.add('card');

  var cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  if (chat.photo) {
    var cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    var imgSrc = document.createElement('img');
    imgSrc.src = chat.photo;
    imgSrc.setAttribute(
      'srcset',
      `
      ${chat.photo}-1024px.jpg 1024w,
      ${chat.photo}-800px.jpg 800w,
      ${chat.photo}-640px.jpg 640w,
      ${chat.photo}-320px.jpg 320w,
    `
    );
    imgSrc.setAttribute(
      'sizes',
      `
      (min-width: 800px) 765px,
      (min-width: 600px) calc(100vw - 32px),
      calc(100vw - 16px)
    `
    );
    cardImage.append(imgSrc);
    card.append(cardImage);
  }

  var avatar = document.createElement('img');
  avatar.classList = 'circle';
  avatar.src = `${chat.avatar}-1x.jpg`;
  avatar.setAttribute(
    'srcset',
    `${chat.avatar}-2x.jpg 2x, ${chat.avatar}-3x.jpg 3x`
  );
  cardContent.append(avatar);

  var name = document.createElement('span');
  name.classList = 'card-title';
  name.innerHTML = chat.name;
  cardContent.append(name);

  var text = document.createElement('p');
  text.innerHTML = chat.body;
  cardContent.append(text);

  card.append(cardContent);

  chatLists.append(card);
}
