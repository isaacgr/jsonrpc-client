const path = require("path");
const express = require("express");

const publicPath = path.join(__dirname, "..", "public");
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(publicPath));

const server = app.listen(port, () => {
  console.log(`Server started on ${port}`);
  app.get("/jsonrpc-client/*", (request, response) => {
    response.sendFile(path.join(publicPath, "index.html"));
  });
});

module.exports = server;
