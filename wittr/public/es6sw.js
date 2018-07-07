// console.log('Service Worker File')

// Semua event fetch akan melalui SW:
// HTML, CSS, JS, Images.

self.addEventListener('fetch', (event) => {
  // TODO: respond semua request dengan sebuah response HTML
  // Dengan elemen class="title"
  // Pastikan Content-Type dari response "text/html"

  // intercept event dengan method respondWith
  // Method tersebut berfungsi untuk override method fetch bawaan dari browser
  
  // Di dalam method tambahkan new Response()
  // Constuctor Response dapat menerima 2 argumen:
  // - body dari response, bisa berupa String, blob, BufferSource
  // - init (options untuk response): headers, status, statusText

  // event.respondWith(
  //   new Response('Hello <b class="title">World</b>', {
  //     headers: { 'Content-Type': 'text/html'}
  //   })
  // );

  // Kita pun bisa intercept dan kirim gambar utk semua request
  // event.respondWith(
  //   fetch('assets/images/dr-evil.gif')
  // )
  console.log(event.request);
})