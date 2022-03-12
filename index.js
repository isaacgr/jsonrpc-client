import React from "react";
import ReactDOM from "react-dom";
import JsonRpcClient from "./src/components/JsonRpcClient";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./src/styles/index.scss";

ReactDOM.render(<JsonRpcClient />, document.getElementById("root"));
