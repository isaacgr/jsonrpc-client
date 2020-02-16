const Jaysonic = require("jaysonic");

class ClientHandler {
  constructor() {
    this.wsClientToTcp = {};
  }
  newClient(host, port, delimiter, timeout, clientId) {
    const client = new Jaysonic.client.tcp({
      host,
      port,
      delimiter,
      timeout
    });
    this.wsClientToTcp[clientId] = client;
  }
  tcpClient(clientId) {
    return this.wsClientToTcp[clientId];
  }
  removeClient(clientId) {
    delete this.wsClientToTcp[clientId];
  }
}

module.exports = ClientHandler;
