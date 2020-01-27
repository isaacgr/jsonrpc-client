const Jaysonic = require("jaysonic/lib/client-ws");

class Client {
  constructor() {
    this.ws = new Jaysonic.wsclient({ timeout: 600 });
  }
  init() {
    return this.ws.connect();
  }
  connect(host, port, delimiter, timeout) {
    return this.ws.request().send("connect", {
      host: host,
      port: port,
      delimiter: delimiter || "\r\n",
      timeout
    });
  }
  serverDisconnected(cb) {
    this.ws.subscribe("tcp.disconnect", () => {
      console.log("TCP server disconnected");
      cb();
    });
  }
  request(method, params) {
    return this.ws.request().send("request", { method, params: params || [] });
  }
  notify(method, params) {
    return this.ws.request().send("notify", { method, params: params || [] });
  }
  startSubscribe(method, cb) {
    return this.ws
      .request()
      .send("start.subscribe", [method])
      .then(() => {
        this.ws.subscribe("subscribe.success", cb);
      });
  }
  stopSubscribe(method, cb) {
    return this.ws
      .request()
      .send("stop.subscribe", [method])
      .then(() => {
        this.ws.subscribe("stop.subscribe.success", cb);
      });
  }
}

export default Client;
