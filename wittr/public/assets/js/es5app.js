document.addEventListener('DOMContentLoaded', function() {
  fillMessages();
  registerServiceWorker();
});

function registerServiceWorker() {
  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/es5sw.js').then(function () {
    console.log('Service Worker Registration Success!');
  }).catch(function () {
    console.log('Service Worker Registration Failed!');
  });
};


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
  card.classList.add('card')
  
  var cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  if (chat.photo) {
    var cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    var imgSrc = document.createElement('img');
    imgSrc.src = chat.photo;
    imgSrc.setAttribute('srcset', `
      ${chat.photo}-1024px.jpg 1024w,
      ${chat.photo}-800px.jpg 800w,
      ${chat.photo}-640px.jpg 640w,
      ${chat.photo}-320px.jpg 320w,
    `);
    imgSrc.setAttribute('sizes', `
      (min-width: 800px) 765px,
      (min-width: 600px) calc(100vw - 32px),
      calc(100vw - 16px)
    `);
    cardImage.append(imgSrc);
    card.append(cardImage);
  }

  var avatar = document.createElement('img');
  avatar.classList = 'circle';
  avatar.src = `${chat.avatar}-1x.jpg`;
  avatar.setAttribute('srcset', `${chat.avatar}-2x.jpg 2x, ${chat.avatar}-3x.jpg 3x`)
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