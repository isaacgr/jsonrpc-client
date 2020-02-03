class SubscriptionHandlder {
  constructor(server) {
    this.server = server;
  }
  handleSubscriptionUpdates(message) {
    this.server.notify([["subscribe.success", [message]]]);
  }
}

module.exports = SubscriptionHandlder;
