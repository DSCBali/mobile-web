// console.log('Service Worker File')

// Semua event fetch akan melalui SW:
// HTML, CSS, JS, Images.

self.addEventListener('fetch', function(event) {
  // event.respondWith(
  //   new Response('Hello <b class="title">World</b>', {
  //     headers: { 'Content-Type': 'text/html'}
  //   })
  // );

  // Kita pun bisa intercept dan kirim gambar utk semua request
  // event.respondWith(
  //   fetch('assets/images/dr-evil.gif')
  // )

  // Cek tiap url yang dikirim
  // console.log(event.request.url);

  // Kita hanya ingin intercept semua request yang meminta sebuah gambar dengan format .jpg
  // if (event.request.url.endsWith('.jpg')) {
  //   event.respondWith(
  //     fetch('assets/images/dr-evil.gif')
  //   );
  // }
})