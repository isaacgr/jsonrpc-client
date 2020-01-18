const Jaysonic = require("jaysonic/lib/client-ws");

class Client {
  constructor(host, port, delimiter) {
    this.host = host;
    this.port = port;
    this.delimiter = delimiter || "\r\n";
    this.ws = new Jaysonic.wsclient({
      host: this.host,
      port: this.port,
      delimiter: this.delimiter
    });
  }
  init() {
    return this.ws.connect();
  }
  connect() {
    return this.ws.request().send("connect", {
      host: this.host,
      port: this.port,
      delimiter: this.delimiter
    });
  }
  request(method, params) {
    return this.ws.request().send(method, params);
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
  notify(method, params) {
    return this.ws.request().send("notify", { method, params });
  }
}

export default Client;
