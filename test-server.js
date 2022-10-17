const Jaysonic = require("jaysonic");

const server = new Jaysonic.server.tcp({ delimiter: "\r\n", port: 8000 });

server.method("hello", () => "hi!");

server.clientConnected = (client) => {
  console.log("client connected");
};

server.clientDisconnected = (client) => {
  server.removeDisconnectedClient(client); // recommended to call along with clientDisconnected to clean up clients list
  console.log("client disconnected");
};

server
  .listen()
  .then(({ host, port }) => {
    console.log(`Server listening on ${host}:${port}`);
  })
  .catch((error) => {
    console.log(`Unable to start server, ${error}`);
  });

server.onNotify("notify", (message) => {
  console.log(message);
  // {jsonrpc: "2.0", method: "notify", params: []}
});
