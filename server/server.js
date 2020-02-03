const path = require("path");
const express = require("express");
const Jaysonic = require("jaysonic");
const SubscriptionHandler = require("./functions/SubscriptionHandler");
const wss = new Jaysonic.server.ws();
const subscriptionHandler = new SubscriptionHandler(wss);
let tcpClient;

const publicPath = path.join(__dirname, "..", "public");
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(publicPath));

const server = app.listen(port, () => {
  console.log(`Server started on ${port}`);
  app.get("/jsonrpc-client/*", (request, response) => {
    response.sendFile(path.join(publicPath, "index.html"));
  });
  wss
    .listen()
    .then(conn => {
      console.log(`WSS listening. ${JSON.stringify(conn)}`);
    })
    .catch(error => {
      console.log(`Unable to start server. ${error}`);
    });
});

const tcpDisconnected = () => {
  console.log("TCP server disconnected");
  wss.notify([["tcp.disconnect", []]]);
};

wss.method("connect", ({ host, port, delimiter, timeout }) => {
  tcpClient = new Jaysonic.client.tcp({ host, port, delimiter, timeout });
  tcpClient.serverDisconnected(tcpDisconnected);
  return new Promise((resolve, reject) => {
    tcpClient
      .connect()
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
});

wss.method("request", ({ method, params }) => {
  return new Promise((resolve, reject) => {
    tcpClient
      .request()
      .send(method, params)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
});

wss.method("notify", ({ method, params }) => {
  return new Promise((resolve, reject) => {
    tcpClient
      .request()
      .notify(method, params)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
});

wss.method("start.subscribe", ([method]) => {
  tcpClient.subscribe(method, subscriptionHandler.handleSubscriptions);
  return `Subscribed to ${method}`;
});

wss.method("stop.subscribe", ([method]) => {
  tcpClient.unsubscribe(method, subscriptionHandler.handleSubscriptions);
  return `Unsubscribed from ${method}`;
});

module.exports = server;
