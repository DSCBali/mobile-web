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
// const dbPromise = idb.open('test-db', 2, function(upgradeDb) {
//   // method createObjectStore untuk membuat sebuah object baru
//   const keyValStore = upgradeDb.createObjectStore('keyval');
//   // method put untuk menambahkan sebuah entry
//   keyValStore.put('world', 'hello');
//   upgradeDb.createObjectStore('people', { keyPath: 'name' });
//   // Coba refresh browser dan lihat console
// });

const dbPromise = idb.open('test-db', 4, function(upgradeDb) {
  // Di sini tidak ada break dalam switch karena ada kemungkinan user mempunyai versi 1
  // dan db yang terbaru berada di versi 4 (misalnya)
  switch (upgradeDb.oldVersion) {
    case 0:
      const keyValStore = upgradeDb.createObjectStore('keyval');
      keyValStore.put('world', 'hello');
    case 1:
      upgradeDb.createObjectStore('people', { keyPath: 'name' });
    case 2:
      const peopleStore = upgradeDb.transaction.objectStore('people');
      peopleStore.createIndex('animal', 'favoriteAnimal');
    case 3:
      const peopleAgeStore = upgradeDb.transaction.objectStore('people');
      peopleAgeStore.createIndex('age', 'age');
  }
});

// Untuk membaca dari idb harus dengan transaction
dbPromise
  .then(function(db) {
    const tx = db.transaction('keyval');
    const keyValStore = tx.objectStore('keyval');
    // menulis 'keyval' 2x memang sedikit repetitive
    // tapi dalam sebuah transaction memungkinkan untuk melakukan operasi dengan lebih dari satu object store
    return keyValStore.get('hello');
  })
  .then(function(val) {
    // karena di atas .get() merupakan sebuah promise
    console.log('The value of hello is: ', val);
  });

// Untuk menulis ke idb harus dengan transaction dan dengan properti 'readwrite'
dbPromise
  .then(function(db) {
    const tx = db.transaction('keyval', 'readwrite');
    const keyValStore = tx.objectStore('keyval');
    keyValStore.put('bar', 'foo');
    return tx.complete; // dikarenakan transaction itu atomic jadi lebih baik return .complete
  })
  .then(function() {
    console.log('Added foo:bar to keyval');
  });

dbPromise
  .then(function(db) {
    const tx = db.transaction('keyval', 'readwrite');
    const keyValStore = tx.objectStore('keyval');
    keyValStore.put('dog', 'favoriteAnimal');
    return tx.complete;
  })
  .then(function() {
    console.log('Added favoriteAnimal to keyval');
  });

dbPromise
  .then(function(db) {
    const tx = db.transaction('people', 'readwrite');
    const peopleStore = tx.objectStore('people');
    // di sini kita tidak menaruh key, karena sudah kita define di atas bahwa 'name' akan menjadi key
    peopleStore.put({
      name: 'Jack Mark',
      age: 20,
      favoriteAnimal: 'dog'
    });

    peopleStore.put({
      name: 'Sam Munoz',
      age: 25,
      favoriteAnimal: 'dog'
    });

    peopleStore.put({
      name: 'Susan Keller',
      age: 34,
      favoriteAnimal: 'cat'
    });

    peopleStore.put({
      name: 'Lillie Wolfe',
      age: 28,
      favoriteAnimal: 'dog'
    });

    peopleStore.put({
      name: 'Marc Stone',
      age: 39,
      favoriteAnimal: 'cat'
    });

    return tx.complete;
  })
  .then(function() {
    console.log('People added');
  });

dbPromise
  .then(function(db) {
    const tx = db.transaction('people');
    const peopleStore = tx.objectStore('people');
    return peopleStore.getAll();
  })
  .then(function(people) {
    console.log('People: ', people);
    // Coba lihat urutan dari people
  });

dbPromise
  .then(function(db) {
    const tx = db.transaction('people');
    const peopleStore = tx.objectStore('people');
    const animalIndex = peopleStore.index('animal');
    return animalIndex.getAll();
    // return animalIndex.getAll('cat'); // query hanya cat
  })
  .then(function(people) {
    console.log('People: ', people);
  });

dbPromise
  .then(function(db) {
    const tx = db.transaction('people');
    const peopleStore = tx.objectStore('people');
    const ageIndex = peopleStore.index('age');
    return ageIndex.getAll();
  })
  .then(function(people) {
    console.log('People sorted by age: ', people);
  });

dbPromise
  .then(function(db) {
    const tx = db.transaction('people');
    const peopleStore = tx.objectStore('people');
    const ageIndex = peopleStore.index('age');
    return ageIndex.openCursor();
  })
  // .then(function(cursor) {
  //   if (!cursor) return;
  //   return cursor.advance(2);
  // })
  .then(function logPerson(cursor) {
    if (!cursor) return;
    console.log('Cursored at: ', cursor.value.name);
    // cursor.update(newValue)
    // cursor.delete()
    return cursor.continue().then(logPerson);
  })
  .then(function() {
    console.log('Done cursoring');
  });
