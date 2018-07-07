/**
 * .open di sini memerlukan 3 argumen
 * - nama db
 * - versi db
 * - callback dari db
 *
 * .open mengembalikan sebuah promise dan resolve valuenya sebuah object db
 * Method ini hanya akan dijalankan sekali oleh browser jika:
 * - nama db belum terdapat dalam browser
 * - versinya lebih besar dari db sebelumnya
 *
 * Hanya di sini kita bisa membuat sebuah object store beserta index nya
 */
const dbPromise = idb.open('test-db', 1, function(upgradeDb) {
  // method createObjectStore untuk membuat sebuah object baru
  const keyValStore = upgradeDb.createObjectStore('keyval');
  // method put untuk menambahkan sebuah entry
  keyValStore.put('world', 'hello');
});

// Untuk membaca dari idb harus dengan transaction
// dbPromise
//   .then(function(db) {
//     const tx = db.transaction('keyval');
//     const keyValStore = tx.objectStore('keyval');
//     // menulis 'keyval' 2x memang sedikit repetitive
//     // tapi dalam sebuah transaction memungkinkan untuk melakukan operasi dengan lebih dari satu object store
//     return keyValStore.get('hello');
//   })
//   .then(function(val) {
//     // karena di atas .get() merupakan sebuah promise
//     console.log('The value of hello is: ', val);
//   });

// Untuk menulis ke idb harus dengan transaction dan dengan properti 'readwrite'
// dbPromise
//   .then(function(db) {
//     const tx = db.transaction('keyval', 'readwrite');
//     const keyValStore = tx.objectStore('keyval');
//     keyValStore.put('bar', 'foo');
//     return tx.complete; // dikarenakan transaction itu atomic jadi lebih baik return .complete
//   })
//   .then(function() {
//     console.log('Added foo:bar to keyval');
//   });

// dbPromise.then(function(db) {
//   // TODO: in the keyval store, set
//   // "favoriteAnimal" to your favorite animal
//   // eg "cat" or "dog"
// });
