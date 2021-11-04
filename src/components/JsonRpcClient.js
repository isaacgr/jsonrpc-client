import React from "react";
import Form from "./Form";
import Client from "../functions/Client";
import ErrorMessage from "./ErrorMessage";
import Terminal from "./Terminal";
import CurrentSubscriptions from "./CurrentSubscriptions";

class JsonRpcClient extends React.Component {
  constructor() {
    super();
    this.state = {
      error: "",
      host: "",
      delimiter: "\r\n",
      port: undefined,
      submitting: false,
      connected: false,
      subscribing: false,
      subscriptions: [],
      method: "",
      params: null,
      response: null,
      timeout: 30
    };
  }

  componentDidMount() {
    this.client = new Client();
    this.client
      .init()
      .then(() => {
        console.log("WS client connected.");
      })
      .catch((response) => {
        this.setState((prevState) => ({
          ...prevState,
          submitting: false,
          response,
          error: response.error.message
        }));
      });
    this.client.serverDisconnected(() => {
      this.setState((prevState) => ({
        ...prevState,
        submitting: false,
        subscribing: false,
        connected: false,
        error: "Server disconnected"
      }));
    });
  }

  onSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    const { request, notify, subscribe } = this.state;
    if (!request && !notify && !subscribe) {
      this.setState((prevState) => ({
        ...prevState,
        error: "Please choose a request type"
      }));
      return;
    }
    try {
      if (request) {
        this.request();
      } else if (notify) {
        this.notify();
      } else if (subscribe) {
        this.startSubscribe();
      } else {
        return;
      }
      this.setState((prevState) => ({
        ...prevState,
        submitting: true,
        error: ""
      }));
    } catch (e) {
      this.setState((prevState) => ({
        ...prevState,
        submitting: false,
        error: e.message
      }));
    }
  };

  connect = () => {
    const { host, port, delimiter, timeout } = this.state;
    return this.client.connect(host, port, delimiter, timeout);
  };

  request = () => {
    const { connected, params } = this.state;
    if (!connected) {
      throw new Error("Not connected");
    }
    const { method } = this.state;
    const parameters = JSON.parse(params);
    this.client
      .request(method, parameters)
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          submitting: false,
          response,
          error: ""
        }));
      })
      .catch((response) => {
        this.setState((prevState) => ({
          ...prevState,
          submitting: false,
          response,
          error: JSON.parse(response.error.message).error.message
        }));
      });
  };

  notify = () => {
    const { connected, params } = this.state;
    if (!connected) {
      throw new Error("Not connected");
    }
    const { method } = this.state;
    const parameters = JSON.parse(params);
    this.client
      .notify(method, parameters)
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          submitting: false,
          response: `Notification sent: ${response.result[0]}`,
          error: ""
        }));
      })
      .catch((response) => {
        this.setState((prevState) => ({
          ...prevState,
          submitting: false,
          response,
          error: `Error when sending notification: ${response.error.message}`
        }));
      });
  };

  handleSubscriptionUpdates = ({ detail }) => {
    this.setState((prevState) => ({
      ...prevState,
      submitting: false,
      response: detail,
      subscribing: true,
      error: ""
    }));
  };

  startSubscribe = () => {
    const { connected, subscriptions } = this.state;
    if (!connected) {
      throw new Error("Not connected");
    }
    const { method } = this.state;
    if (subscriptions.includes(method)) {
      return;
    }
    this.client
      .startSubscribe(method, this.handleSubscriptionUpdates)
      .then(() => {
        this.setState(
          (prevState) => ({
            ...prevState,
            submitting: false,
            subscriptions: [...prevState.subscriptions, method]
          }),
          () => {
            const { subscriptions } = this.state;
            if (subscriptions.length === 1) {
              this.setState((prevState) => ({
                ...prevState,
                unsubscribe: prevState.subscriptions[0]
              }));
            }
          }
        );
      })
      .catch((response) => {
        this.setState((prevState) => ({
          ...prevState,
          submitting: false,
          response,
          error: response.error.message
        }));
      });
  };

  stopSubscribe = () => {
    // e.preventDefault();
    const { subscriptions, unsubscribe } = this.state;
    const method = unsubscribe;
    this.client
      .stopSubscribe(method, this.handleSubscriptionUpdates)
      .then(() => {
        const newSubs = subscriptions.filter((value) => value !== method);
        this.setState(
          (prevState) => ({
            ...prevState,
            submitting: false,
            subscriptions: newSubs
          }),
          () => {
            const { subscriptions } = this.state;
            if (subscriptions.length === 1) {
              this.setState((prevState) => ({
                ...prevState,
                unsubscribe: prevState.subscriptions[0]
              }));
            }
          }
        );
      })
      .catch((response) => {
        this.setState((prevState) => ({
          ...prevState,
          submitting: false,
          response,
          error: response.error.message
        }));
      });
  };

  formatJson = () => {
    var ugly = this.state.params.replace(/'/g, '"').replace(/\bNone\b(?!.)/g, null);
    var obj = JSON.parse(ugly);
    var pretty = JSON.stringify(obj, undefined, 2);
    this.setState((prevState) => ({
      ...prevState,
      params: pretty
    }));
  };

  buttonPressed = () => {
    this.connect()
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          connected: true,
          submitting: false,
          response,
          error: ""
        }));
      })
      .catch((response) => {
        this.setState((prevState) => ({
          ...prevState,
          submitting: false,
          connected: false,
          response,
          error: response.error.message
        }));
      });
  };

  handleChange = (e) => {
    const { name } = e.target;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    switch (name) {
      case "request":
        this.setState((prevState) => ({
          ...prevState,
          [name]: value,
          response: null,
          subscribe: false,
          notify: false
        }));
        break;
      case "notify":
        this.setState((prevState) => ({
          ...prevState,
          [name]: value,
          request: false,
          response: null,
          subscribe: false
        }));
        break;
      case "subscribe":
        this.setState((prevState) => ({
          ...prevState,
          [name]: value,
          request: false,
          response: null,
          notify: false
        }));
        break;
      case "params":
        this.setState((prevState) => ({
          ...prevState,
          [name]: value === "" ? null : value
        }));
        break;
      default:
        this.setState((prevState) => ({
          ...prevState,
          [name]: value
        }));
        break;
    }
  };

  render() {
    const { subscriptions, error, submitting, response } = this.state;
    return (
      <div className="container">
        <Form
          state={this.state}
          onSubmit={this.onSubmit}
          handleChange={this.handleChange}
          buttonPressed={this.buttonPressed}
          formatJson={this.formatJson}
        />
        {subscriptions.length > 0 ? (
          <CurrentSubscriptions
            subscriptions={subscriptions}
            stopSubscribe={this.stopSubscribe}
            handleChange={this.handleChange}
          />
        ) : (
          ""
        )}
        {error && !submitting ? <ErrorMessage message={error} /> : ""}
        <Terminal text={response} />
      </div>
    );
  }
}

export default JsonRpcClient;
