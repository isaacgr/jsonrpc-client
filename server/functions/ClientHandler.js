const Jaysonic = require("jaysonic");

class SubHandler {
  constructor(wss, method) {
    this.method = method;
    this.wss = wss;
  }
  handleSubscriptionUpdates(message) {
    this.wss.notify([[this.method, [message]]]);
  }
}

class ClientHandler {
  constructor() {
    this.wsClientToTcp = {};
    this.subscriptions = {};
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
  subscriptionHandler(wss, method) {
    const subhandler = new SubHandler(wss, method);
    const updateHandler = subhandler.handleSubscriptionUpdates.bind(subhandler);
    this.subscriptions[method] = updateHandler;
    return updateHandler;
  }
}

module.exports = ClientHandler;
