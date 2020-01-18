const Jaysonic = require("jaysonic/lib/client-ws");

class Client {
  constructor() {
    this.ws = new Jaysonic.wsclient();
  }
  init() {
    return this.ws.connect();
  }
  connect(host, port, delimiter) {
    return this.ws.request().send("connect", {
      host: host,
      port: port,
      delimiter: delimiter || "\n"
    });
  }
  request(method, params) {
    return this.ws.request().send(method, params);
  }
  notify(method, params) {
    return this.ws.request().send("notify", { method, params });
  }
  startSubscribe(method, cb) {
    this.cb = cb;
    return this.ws
      .request()
      .send("start.subscribe", [method])
      .then(() => {
        this.ws.subscribe("subscribe", (error, message) => {
          this.cb(error, message);
        });
      });
  }
  stopSubscribe() {
    this.cb = undefined;
  }
}

export default Client;
