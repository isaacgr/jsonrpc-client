class SubHandler {
  constructor(wss, method) {
    this.method = method;
    this.wss = wss;
  }

  handleSubscriptionUpdates(message) {
    this.wss.notify([[this.method, [message]]]);
  }
}

module.exports = SubHandler;
