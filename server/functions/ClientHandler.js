const Jaysonic = require("jaysonic");
const SubHandler = require("./SubscriptionHandler");

class ClientHandler {
  constructor() {
    this.wsClientToTcp = {};
    this.subscriptions = {};
    this.wsClientToTcpTimeout = {};
  }

  newClient(host, port, delimiter, timeout, clientId) {
    if (this.wsClientToTcp[clientId]) {
      console.log(`Client connection exists. Re-using. [${clientId}]`);
      return;
    }
    const Client = new Jaysonic.client.tcp({
      host,
      port,
      delimiter,
      timeout
    });
    this.wsClientToTcp[clientId] = Client;
  }

  tcpClient(clientId) {
    return this.wsClientToTcp[clientId];
  }

  removeClient(clientId) {
    console.log(`Removing client. [${clientId}]`);
    delete this.wsClientToTcp[clientId];
  }

  subscriptionHandler(wss, method) {
    const SubscriptionHandler = new SubHandler(wss, method);
    const updateHandler =
      SubscriptionHandler.handleSubscriptionUpdates.bind(SubscriptionHandler);
    this.subscriptions[method] = updateHandler;
    return updateHandler;
  }
}

module.exports = ClientHandler;
