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
    subscriptions: [],
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

  const stopSubscribe = async (unsubscribe) => {
    // e.preventDefault();
    const { subscriptions } = state;
    const method = unsubscribe;
    try {
      await client.stopSubscribe(method, handleSubscriptionUpdates);
      const newSubs = subscriptions.filter((value) => value !== method);
      setState((prevState) => ({
        ...prevState,
        submitting: false,
        subscriptions: newSubs
      }));
    } catch (e) {
      console.log(e);
      setState((prevState) => ({
        ...prevState,
        submitting: false,
        error: e.error.message
      }));
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
        case "subscribe":
          const { subscriptions } = state;
          if (subscriptions.includes(method)) {
            throw new Error("Method already subscribed.");
          }
          await client.startSubscribe(method, handleSubscriptionUpdates);
          setState((prevState) => ({
            ...prevState,
            submitting: false,
            subscriptions: [...prevState.subscriptions, method]
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
        setState((prevState) => ({
          ...prevState,
          submitting: false,
          response: JSON.parse(e.error.message),
          error: `${JSON.parse(e.error.message).error?.message}${
            e.error.data ? ` : ${e.error.data}` : ""
          }`
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
      {state.subscriptions.length > 0 && (
        <CurrentSubscriptions
          subscriptions={state.subscriptions}
          stopSubscribe={stopSubscribe}
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
