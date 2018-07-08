document.addEventListener('DOMContentLoaded', () => {
  fillMessages();
  registerServiceWorker();
  cleanImageCaches();
});

const cleanImageCaches = () => {
  DBHelper.openDb().then(db => {
    if (!db) return;

    const imagesNeeded = [];
    const tx = db.transaction('wittrs');
    return tx
      .objectStore('wittrs')
      .getAll()
      .then(messages => {
        messages.forEach(message => {
          if (message.photo) {
            imagesNeeded.push(message.photo);
          }
          imagesNeeded.push(message.avatar);
        });

        return caches.open('wittr-content-imgs');
      })
      .then(cache => {
        return cache.keys().then(requests => {
          // console.log(requests);
          requests.forEach(request => {
            const url = new URL(request.url);
            if (!imagesNeeded.includes(url.pathname)) {
              cache.delete(request);
            }
          });
        });
      });
  });
};

const registerServiceWorker = () => {
  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/es6sw.js').then(reg => {
    if (!navigator.serviceWorker.controller) return;

    if (reg.waiting) {
      updateReady(reg.waiting);
      return;
    }

    if (reg.installing) {
      trackInstalling(reg.installing);
      return;
    }

    reg.addEventListener('updatefound', () => {
      trackInstalling(reg.installing);
    });
  });

  // Ensure refresh is only called once.
  // This works around a bug in "force update on reload".
  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
};

const syncMessage = () => {
  // alert('ALERTED!');
  navigator.serviceWorker.ready.then(registration => {
    Notification.requestPermission();
    registration.sync.register('showAlert');
  });
};

let currentWorker;

const postWorkerMessage = () => {
  currentWorker.postMessage({ action: 'skipWaiting' });
};

const updateReady = worker => {
  currentWorker = worker;
  const toastHTML = `<span>New version is available</span><button onclick="postWorkerMessage()" class="btn-flat toast-action">Refresh</button>`;
  M.toast({ html: toastHTML, displayLength: 60000 });
};

const trackInstalling = worker => {
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') {
      updateReady(worker);
    }
  });
};

const fillMessages = () => {
  DBHelper.fetchMessages().then(messages => {
    const chatLists = document.getElementById('chat-lists');
    console.log(messages);

    messages.forEach(chat => {
      createList(chatLists, chat);
    });
  });
};

/**
 * Hiraukan code di bawah ini
 */

const createList = (chatLists, chat) => {
  const card = document.createElement('div');
  card.classList.add('card');

  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  if (chat.photo) {
    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    const imgSrc = document.createElement('img');
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

  const avatar = document.createElement('img');
  avatar.classList = 'circle';
  avatar.src = `${chat.avatar}-1x.jpg`;
  avatar.setAttribute(
    'srcset',
    `${chat.avatar}-2x.jpg 2x, ${chat.avatar}-3x.jpg 3x`
  );
  cardContent.append(avatar);

  const name = document.createElement('span');
  name.classList = 'card-title';
  name.innerHTML = chat.name;
  cardContent.append(name);

  const text = document.createElement('p');
  text.innerHTML = chat.body;
  cardContent.append(text);

  card.append(cardContent);

  chatLists.append(card);
};
