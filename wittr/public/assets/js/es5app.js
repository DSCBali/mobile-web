document.addEventListener('DOMContentLoaded', function() {
  fillMessages();
  registerServiceWorker();
});

function registerServiceWorker() {
  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/es5sw.js').then(function(reg) {
    // Jika tidak ada controller, page ini tidak di load dengan SW jadinya page ini ada di versi terbaru.
    if (!navigator.serviceWorker.controller) return;

    // Jika ada update sudah menunggu
    if (reg.waiting) {
      updateReady(reg.waiting);
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

  // Ensure refresh is only called once.
  // This works around a bug in "force update on reload".
  var refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}

var currentWorker;

function postWorkerMessage() {
  currentWorker.postMessage({ action: 'skipWaiting' });
}

function updateReady(worker) {
  currentWorker = worker;
  var toastHTML = `<span>New version is available</span><button onclick="postWorkerMessage()" class="btn-flat toast-action">Refresh</button>`;
  M.toast({ html: toastHTML, displayLength: 60000 });
}

function trackInstalling(worker) {
  worker.addEventListener('statechache', function() {
    if (worker.state === 'installed') {
      updateReady(worker);
    }
  });
}

/**
 * Hiraukan code di bawah ini
 */

function fillMessages() {
  DBHelper.fetchMessages().then(function(messages) {
    var chatLists = document.getElementById('chat-lists');

    messages.forEach(function(chat) {
      createList(chatLists, chat);
    });
  });
}

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
