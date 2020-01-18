// entry -> output
const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.join(__dirname, "public", "jsonrpc-client"),
    filename: "bundle.js",
    publicPath: "/jsonrpc-client"
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: path.join(__dirname, "public"),
    historyApiFallback: true,
    proxy: {
      "/api/*": {
        target: "http://localhost:3000"
      },
      "/jsonrpc-client/*": {
        target: "http://localhost:3000"
      }
    }
  }
};
