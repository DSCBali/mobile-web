class DBHelper {
  static openDb() {
    return idb.open('wittr', 1, function(upgradeDb) {
      const store = upgradeDb.createObjectStore('wittrs', { keyPath: 'id' });
      store.createIndex('by-date', 'time');
    });
  }

  static writeToDb(messages) {
    DBHelper.openDb().then(db => {
      if (!db) return;

      const tx = db.transaction('wittrs', 'readwrite');
      const store = tx.objectStore('wittrs');

      messages.forEach(chat => {
        store.put(chat);
      });

      store
        .index('by-date')
        .openCursor(null, 'prev')
        .then(cursor => {
          return cursor.advance(15);
        })
        .then(function deleteRest(cursor) {
          if (!cursor) return;
          cursor.delete();
          return cursor.continue().then(deleteRest);
        });
    });
  }

  static fetchMessagesFromDb() {
    return DBHelper.openDb().then(db => {
      if (!db) return;

      const index = db
        .transaction('wittrs')
        .objectStore('wittrs')
        .index('by-date');

      return index.getAll().then(messages => {
        return messages;
      });
    });
  }

  static fetchMessages() {
    return DBHelper.fetchMessagesFromNetwork()
      .then(function(messages) {
        DBHelper.writeToDb(messages);
        return messages;
      })
      .catch(function(err) {
        console.log('You are offline, fetching from DB');
        return DBHelper.fetchMessagesFromDb();
      });
  }

  static fetchMessagesFromNetwork() {
    return fetch('/chats').then(response => response.json());
  }
}
