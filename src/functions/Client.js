const Jaysonic = require("jaysonic/lib/client-ws");
import { v4 as uuidv4 } from "uuid";

class Client {
  constructor() {
    this.ws = new Jaysonic.wsclient({ timeout: 600 });
    this.clientId = uuidv4();
  }

  init() {
    return this.ws.connect();
  }

  connect(host, port, delimiter, timeout) {
    return this.ws.request().send("connect", {
      host,
      port,
      delimiter: delimiter || "\r\n",
      timeout,
      clientId: this.clientId
    });
  }

  tcpServerDisconnected(cb) {
    this.ws.subscribe("tcp.disconnect", () => {
      console.log("TCP server disconnected");
      cb();
    });
  }

  ping(eb) {
    const _this = this;
    setInterval(async () => {
      try {
        await _this.ws.request().send("ping", [_this.clientId]);
      } catch (e) {
        eb(e);
      }
    }, 5000);
  }

  request(method, params) {
    return this.ws.request().send("request", {
      method,
      params,
      clientId: this.clientId
    });
  }

  notify(method, params) {
    return this.ws.request().send("notify", {
      method,
      params,
      clientId: this.clientId
    });
  }

  startSubscribe(method, cb) {
    return this.ws
      .request()
      .send("start.subscribe", [method, this.clientId])
      .then(() => {
        this.ws.subscribe(method, cb);
      });
  }

  stopSubscribe(method) {
    return this.ws
      .request()
      .send("stop.subscribe", [method, this.clientId])
      .then(() => {
        this.ws.unsubscribeAll(method);
      });
  }
}

export default Client;
