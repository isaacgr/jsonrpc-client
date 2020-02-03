class SubscriptionHandlder {
  constructor(client) {
    this.client = client;
  }
  handleSubscriptionUpdates({ detail }) {
    this.client.setState(prevState => ({
      ...prevState,
      submitting: false,
      response: detail,
      subscribing: true,
      error: ""
    }));
  }
}

export default SubscriptionHandlder;
