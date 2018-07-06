const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http');
const markovCreator = require('markov');
const random = require('lodash/random');
const photos = require('./photos');

const markov = markovCreator(3);

const generateReady = new Promise(resolve => {
  markov.seed(fs.createReadStream(__dirname + '/seed.txt'), resolve);
});

const generateMessages = () => {
  const users = [
    {avatar: "marc", name: "Marc Stone"},
    {avatar: "ellen", name: "Ellen Clayton"},
    {avatar: "ruth", name: "Ruth Maxwell"},
    {avatar: "ray", name: "Ray Scott"},
    {avatar: "sam", name: "Sam Munoz"},
    {avatar: "craig", name: "Craig Robbins"},
    {avatar: "lillie", name: "Lillie Wolfe"},
    {avatar: "susan", name: "Susan Keller"}
  ];

  return new Promise(resolve => {
    generateReady.then(() => {
      const messages = [];
      for (let i = 0; i < 15; i++) {
        const message = {};
        const user = users[Math.floor(Math.random() * users.length)];
        let image;
    
        if (Math.random() < 0.2) {
          image = photos[Math.floor(Math.random() * photos.length)];
        }
      
        message.id = Number(String(random(1, 10000)) + Date.now()).toString(36);
        message.avatar = '/avatars/' + user.avatar;
        message.name = user.name;
        message.time = new Date().toISOString();
        message.body = markov.fill(markov.pick(), random(3, 15)).join(' ');
        
        if (image) {
          message.photo = `/photos/${image.farm}-${image.server}-${image.id}-${image.secret}`;
        }
        messages.push(message);
      }
      resolve(messages);
    });
  })
}

app.get('/chats', (req, res) => {
  generateMessages().then(data => {
    return res.send(data);
  });
});
app.use(express.static('public'));

const imgSizeToFlickrSuffix = {
  '1024px': 'b',
  '800px': 'c',
  '640px': 'z',
  '320px': 'n'
};

app.get('/photos/:farm-:server-:id-:secret-:type.jpg', (req, res) => {
  const flickrUrl = `http://farm${req.params.farm}.staticflickr.com/${req.params.server}/${req.params.id}_${req.params.secret}_${imgSizeToFlickrSuffix[req.params.type]}.jpg`;
  const flickrRequest = http.request(flickrUrl, flickrRes => {
    flickrRes.pipe(res);
  });

  flickrRequest.on('error', err => {
    res.sendFile('icon.png', {
      root: __dirname + '/public/'
    });
  });

  flickrRequest.end();
});

app.listen(5007, function () {
  console.log('App is listening on port 5007!\n');
});