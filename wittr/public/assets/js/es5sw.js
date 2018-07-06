// console.log('Service Worker File')

// Semua event fetch akan melalui SW:
// HTML, CSS, JS, Images.

self.addEventListener('fetch', function(event) {
  console.log(event.request);
})