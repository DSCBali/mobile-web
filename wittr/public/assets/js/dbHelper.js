class DBHelper {
  static fetchMessages() {
    return fetch('/chats').then(response => response.json());
  }
}
