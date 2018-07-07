const dbPromise = idb.open('test-db', 1, function(upgradeDb) {
  const keyValStore = upgradeDb.createObjectStore('keyval');
  keyValStore.put('world', 'hello');
});

dbPromise
  .then(function(db) {
    const tx = db.transaction('keyval');
    const keyValStore = tx.objectStore('keyval');
    return keyValStore.get('hello');
  })
  .then(function(val) {
    console.log('The value of hello is: ', val);
  });

dbPromise
  .then(function(db) {
    const tx = db.transaction('keyval', 'readwrite');
    const keyValStore = tx.objectStore('keyval');
    keyValStore.put('bar', 'foo');
    return tx.complete;
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
