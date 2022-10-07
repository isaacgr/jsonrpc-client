import React, { useState, useEffect } from "react";
import Form from "./Form";
import Client from "../functions/Client";
import ErrorMessage from "./ErrorMessage";
import Terminal from "./Terminal";
import CurrentSubscriptions from "./CurrentSubscriptions";

const JsonRpcClient = () => {
  const [client] = useState(new Client());
  const [state, setState] = useState({
    error: "",
    host: "",
    delimiter: "\r\n",
    port: null,
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

  const connect = async () => {
    const { host, port, delimiter, timeout } = state;
    try {
      await client.connect(host, port, delimiter, timeout);
      setState((prevState) => ({
        ...prevState,
        connected: true,
        error: ""
      }));
    } catch (e) {
      setState((prevState) => ({
        ...prevState,
        error: e.error.message,
        connected: false
      }));
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
      setState((prevState) => ({
        ...prevState,
        submitting: true,
        error: ""
      }));
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
      this.setState(
        (prevState) => ({
          ...prevState,
          submitting: false,
          subscriptions: newSubs
        }),
        () => {
          const { subscriptions } = state;
          if (subscriptions.length === 1) {
            setState((prevState) => ({
              ...prevState,
              unsubscribe: prevState.subscriptions[0]
            }));
          }
        }
      );
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        submitting: false,
        response,
        error: response.error.message
      }));
    }
  };

  const formatJson = () => {
    var ugly = state.params.replace(/'/g, '"').replace(/\bNone\b(?!")/g, null);
    var obj = JSON.parse(ugly);
    var pretty = JSON.stringify(obj, undefined, 2);
    setState((prevState) => ({
      ...prevState,
      params: pretty
    }));
  };

  const sendRequest = async (queryType) => {
    const { connected, params } = state;
    if (!connected) {
      throw new Error("Not connected");
    }
    const parameters = JSON.parse(params);
    let response;
    try {
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
          const { connected, subscriptions } = state;
          if (!connected) {
            throw new Error("Not connected");
          }
          if (subscriptions.includes(method)) {
            return;
          }
          await client.startSubscribe(method, handleSubscriptionUpdates);
          setState(
            (prevState) => ({
              ...prevState,
              submitting: false,
              subscriptions: [...prevState.subscriptions, method]
            }),
            () => {
              const { subscriptions } = this.state;
              if (subscriptions.length === 1) {
                setState((prevState) => ({
                  ...prevState,
                  unsubscribe: prevState.subscriptions[0]
                }));
              }
            }
          );
          break;
        default:
          break;
      }
    } catch (e) {
      setState((prevState) => ({
        ...prevState,
        submitting: false,
        response: JSON.parse(e.error.message),
        error: JSON.parse(e.error.message).error.message
      }));
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
    client.serverDisconnected(() => {
      setState((prevState) => ({
        ...prevState,
        submitting: false,
        subscribing: false,
        connected: false,
        error: "Server disconnected"
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
        formatJson={formatJson}
      />
      {state.subscriptions.length > 0 && (
        <CurrentSubscriptions
          subscriptions={state.subscriptions}
          stopSubscribe={stopSubscribe}
        />
      )}
      {state.error && !state.submitting ? (
        <ErrorMessage message={state.error} />
      ) : (
        ""
      )}
      <Terminal text={state.response} />
    </div>
  );
};

export default JsonRpcClient;
