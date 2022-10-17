import React, { useState, useEffect } from "react";
import Form from "./Form";
import Client from "../functions/Client";
import Terminal from "./Terminal";
import CurrentSubscriptions from "./CurrentSubscriptions";
import Alert from "@mui/material/Alert";

const JsonRpcClient = () => {
  const [client] = useState(new Client());
  const [state, setState] = useState({
    error: "",
    host: "",
    delimiter: "\r\n",
    port: null,
    connectedHost: "",
    submitting: false,
    connected: false,
    subscribing: false,
    method: "",
    params: null,
    response: null,
    queryType: "request",
    timeout: 30
  });

  const disconnect = async () => {
    try {
      const { result } = await client.disconnect();
      console.log(result);
      setState((prevState) => ({
        ...prevState,
        connected: false,
        connectedHost: ""
      }));
    } catch (e) {
      if (e instanceof Error) {
        setState((prevState) => ({
          ...prevState,
          submitting: false,
          response: null,
          error: e.message
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          error: `${e.error.message}${
            e.error.data ? ` : ${e.error.data}` : ""
          }`,
          connected: false,
          connectedHost: ""
        }));
      }
    }
  };

  const connect = async () => {
    const { host, port, delimiter, timeout } = state;
    setState((prevState) => ({
      ...prevState,
      connected: false,
      error: ""
    }));
    try {
      const { result } = await client.connect(host, port, delimiter, timeout);
      setState((prevState) => ({
        ...prevState,
        connected: true,
        connectedHost: `${result.host}:${result.port}`
      }));
    } catch (e) {
      if (e instanceof Error) {
        setState((prevState) => ({
          ...prevState,
          submitting: false,
          response: null,
          error: e.message
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          error: `${e.error.message}${
            e.error.data ? ` : ${e.error.data}` : ""
          }`,
          connected: false,
          connectedHost: ""
        }));
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    if (!state.queryType) {
      setState((prevState) => ({
        ...prevState,
        error: "Please choose a request type"
      }));
      return;
    }
    try {
      sendRequest(state.queryType);
    } catch (e) {
      setState((prevState) => ({
        ...prevState,
        submitting: false,
        error: e.message
      }));
    }
  };

  const handleSubscriptionUpdates = ({ detail }) => {
    setState((prevState) => ({
      ...prevState,
      submitting: false,
      response: detail,
      subscribing: true,
      error: ""
    }));
  };

  const startSubscribe = async (method) => {
    try {
      if (Object.keys(client.ws.getEventListeners()).includes(method)) {
        throw new Error("Method already subscribed.");
      }
      await client.startSubscribe(method, handleSubscriptionUpdates);
      setState((prevState) => ({
        ...prevState,
        submitting: false
      }));
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        setState((prevState) => ({
          ...prevState,
          response: null,
          error: e.message
        }));
      } else {
        const errorMessage = JSON.parse(e.error.message);
        setState((prevState) => ({
          ...prevState,
          response: errorMessage,
          error: `${
            errorMessage.error ? errorMessage.error.message : errorMessage
          }${e.error.data ? ` : ${e.error.data}` : ""}`
        }));
      }
    }
  };

  const stopSubscribe = async (method) => {
    try {
      if (!Object.keys(client.ws.getEventListeners()).includes(method)) {
        throw new Error("Method not currently subscribed.");
      }
      await client.stopSubscribe(method, handleSubscriptionUpdates);
      setState((prevState) => ({
        ...prevState,
        submitting: false
      }));
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        setState((prevState) => ({
          ...prevState,
          response: null,
          error: e.message
        }));
      } else {
        const errorMessage = JSON.parse(e.error.message);
        setState((prevState) => ({
          ...prevState,
          response: errorMessage,
          error: `${
            errorMessage.error ? errorMessage.error.message : errorMessage
          }${e.error.data ? ` : ${e.error.data}` : ""}`
        }));
      }
    }
  };

  const sendRequest = async (queryType) => {
    const { connected, params } = state;
    const parameters = JSON.parse(params);
    let response;
    setState((prevState) => ({
      ...prevState,
      submitting: true,
      error: ""
    }));
    try {
      if (!connected) {
        throw new Error("Not connected");
      }
      const { method } = state;
      switch (queryType) {
        case "request":
          response = await client.request(method, parameters);
          setState((prevState) => ({
            ...prevState,
            submitting: false,
            response,
            error: ""
          }));
          break;
        case "notify":
          response = await client.notify(method, parameters);
          setState((prevState) => ({
            ...prevState,
            submitting: false,
            response: `Notification sent: ${response.result}`,
            error: ""
          }));
          break;
        default:
          break;
      }
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        setState((prevState) => ({
          ...prevState,
          submitting: false,
          response: null,
          error: e.message
        }));
      } else {
        const errorMessage = JSON.parse(e.error.message);
        setState((prevState) => ({
          ...prevState,
          submitting: false,
          response: errorMessage,
          error: `${
            errorMessage.error ? errorMessage.error.message : errorMessage
          }${e.error.data ? ` : ${e.error.data}` : ""}`
        }));
      }
    }
  };

  useEffect(() => {
    client
      .init()
      .then(() => {
        console.log("WS client connected.");
      })
      .catch((response) => {
        setState((prevState) => ({
          ...prevState,
          submitting: false,
          response,
          error: response.error.message
        }));
      });
    client.ping(() => {
      setState((prevState) => ({
        ...prevState,
        submitting: false,
        subscribing: false,
        connected: false,
        error: "WS Server disconnected"
      }));
    });
    client.tcpServerDisconnected(() => {
      setState((prevState) => ({
        ...prevState,
        submitting: false,
        subscribing: false,
        connected: false,
        error: "TCP Server disconnected"
      }));
    });
  }, []);

  return (
    <div className="container">
      <Form
        state={state}
        setState={setState}
        onSubmit={onSubmit}
        connect={connect}
        disconnect={disconnect}
      />
      {state.connected && (
        <CurrentSubscriptions
          stopSubscribe={stopSubscribe}
          startSubscribe={startSubscribe}
        />
      )}
      <div className="content-block">
        {state.error && !state.submitting ? (
          <Alert
            style={{ width: "50%", margin: "0 auto 1rem auto" }}
            severity="error"
          >
            {state.error}
          </Alert>
        ) : (
          ""
        )}
      </div>
      <Terminal text={state.response} />
    </div>
  );
};

export default JsonRpcClient;
