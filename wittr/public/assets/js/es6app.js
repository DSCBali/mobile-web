document.addEventListener('DOMContentLoaded', () => {
  fillMessages();
  registerServiceWorker();
});

const registerServiceWorker = () => {
  // TODO Registrasi SW di sini
}


/**
 * Hiraukan code di bawah ini
 */

const fillMessages = () => {
  DBHelper.fetchMessages().then(messages => {
    const chatLists = document.getElementById('chat-lists');

    messages.forEach(chat => {
      createList(chatLists, chat);
    });
  });
}

const createList = (chatLists, chat) => {
  const card = document.createElement('div');
  card.classList.add('card')
  
  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  if (chat.photo) {
    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    const imgSrc = document.createElement('img');
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

  const avatar = document.createElement('img');
  avatar.classList = 'circle';
  avatar.src = `${chat.avatar}-1x.jpg`;
  avatar.setAttribute('srcset', `${chat.avatar}-2x.jpg 2x, ${chat.avatar}-3x.jpg 3x`)
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
}