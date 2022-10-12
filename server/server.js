const path = require("path");
const express = require("express");
const Jaysonic = require("jaysonic");
const ClientHandler = require("./functions/ClientHandler");

const wss = new Jaysonic.server.ws({ host: "0.0.0.0" });
const clientHandler = new ClientHandler();

const publicPath = path.join(__dirname, "..", "public");
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(publicPath));

const server = app.listen(port, () => {
  console.log(`Server started on ${port}`);
  app.get("/", (request, response) => {
    response.sendFile(path.join(publicPath, "index.html"));
  });
  wss
    .listen()
    .then((conn) => {
      console.log(`WSS listening. ${JSON.stringify(conn)}`);
    })
    .catch((error) => {
      console.log(`Unable to start server. ${error}`);
    });
});

const tcpDisconnected = (clientId) => {
  console.log("TCP server disconnected");
  // delete ws client reference from handler class
  clientHandler.removeClient(clientId);
  wss.notify([["tcp.disconnect", [clientId]]]);
};

wss.method("connect", ({ host, port, delimiter, timeout, clientId }) => {
  // create a new tcp client for this client id
  clientHandler.newClient(host, port, delimiter, timeout, clientId);
  // subscribe the tcp server to serverDisconnected
  clientHandler
    .tcpClient(clientId)
    .serverDisconnected(() => tcpDisconnected(clientId));
  return new Promise((resolve, reject) => {
    clientHandler
      .tcpClient(clientId)
      .connect()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
});

wss.method("ping", async ([clientId]) => {
  try {
    if (clientHandler.wsClientToTcpTimeout[clientId]) {
      clearTimeout(clientHandler.wsClientToTcpTimeout[clientId]);
      clientHandler.wsClientToTcpTimeout[clientId] = setTimeout(() => {
        if (clientHandler.wsClientToTcp[clientId]) {
          clientHandler.wsClientToTcp[clientId].end();
        }
      }, 20000);
    } else {
      clientHandler.wsClientToTcpTimeout[clientId] = setTimeout(() => {
        if (clientHandler.wsClientToTcp[clientId]) {
          clientHandler.wsClientToTcp[clientId].end();
        }
      }, 20000);
    }
    return "pong";
  } catch (e) {
    console.log(e);
    return e;
  }
});

wss.method(
  "request",
  ({ method, params, clientId }) =>
    new Promise((resolve, reject) => {
      clientHandler
        .tcpClient(clientId)
        .request()
        .send(method, params)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    })
);

wss.method(
  "notify",
  ({ method, params, clientId }) =>
    new Promise((resolve, reject) => {
      clientHandler
        .tcpClient(clientId)
        .request()
        .notify(method, params)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    })
);

wss.method("start.subscribe", ([method, clientId]) => {
  const subs = clientHandler.subscriptionHandler(wss, method);
  clientHandler.tcpClient(clientId).subscribe(method, subs);
  return `Subscribed to "${method}"`;
});

wss.method("stop.subscribe", ([method, clientId]) => {
  clientHandler.tcpClient(clientId).unsubscribeAll(method);
  return `Unsubscribed from ${method}`;
});

module.exports = server;
