import React from "react";
import ReactDOM from "react-dom";
import JsonRpcClient from "./src/components/JsonRpcClient";

import "./src/styles/styles.scss";

const jsx = <JsonRpcClient />;

ReactDOM.render(jsx, document.getElementById("root"));
