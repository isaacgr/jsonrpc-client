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
  connect() {
    return this.ws.connect();
  }
  request(method, params) {
    return this.ws.request().send(method, params);
  }
  subscribe(method, cb) {
    this.ws.subscribe(method, (error, message) => {
      cb(error, message);
    });
  }
  notify(method, params) {
    return this.ws.request().notify(method, params);
  }
}

export default Client;
