const path = require("path");
const express = require("express");
const Jaysonic = require("jaysonic");
const wss = new Jaysonic.server.ws();
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
    .then(() => {
      console.log(`WSS listening.`);
    })
    .catch((error) => {
      console.log(`Unable to start server. ${error}`);
    });
});

wss.method("connect", ({ host, port, delimiter }) => {
  tcpClient = new Jaysonic.client.tcp({ host, port, delimiter });
  return new Promise((resolve, reject) => {
    tcpClient
      .connect()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
});

wss.method("request", ({ method, params }) => {
  return new Promise((resolve, reject) => {
    tcpClient
      .request()
      .send(method, params)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
});

wss.method("notify", ({ method, params }) => {
  return new Promise((resolve, reject) => {
    tcpClient
      .request()
      .notify(method, params)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
});

wss.method("start.subscribe", ([method]) => {
  return new Promise((resolve, reject) => {
    tcpClient.subscribe(method, (error, message) => {
      if (error) {
        reject(error);
      } else {
        resolve(`Subscribed to ${method}`);
      }
    });
  });
});

module.exports = server;
