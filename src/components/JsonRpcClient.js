import React from "react";
import { Component } from "react";
import Form from "./Form";
import Client from "../functions/Client";
import ErrorMessage from "./ErrorMessage";
import Terminal from "./Terminal";
import CurrentSubscriptions from "./CurrentSubscriptions";

class JsonRpcClient extends Component {
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
      .then((result) => {
        console.log("WS client connected.");
      })
      .catch((response) => {
        this.setState((prevState) => ({
          ...prevState,
          submitting: false,
          response: response,
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
  connect = () => {
    const { host, port, delimiter, timeout } = this.state;
    return this.client.connect(host, port, delimiter, timeout);
  };
  request = () => {
    if (!this.state.connected) {
      throw new Error("Not connected");
    }
    const method = this.state.method;
    try {
      const params = JSON.parse(this.state.params);
      this.client
        .request(method, params)
        .then((response) => {
          this.setState((prevState) => ({
            ...prevState,
            submitting: false,
            response: response,
            error: ""
          }));
        })
        .catch((response) => {
          this.setState((prevState) => ({
            ...prevState,
            submitting: false,
            response: response,
            error: JSON.parse(response.error.message).error.message
          }));
        });
    } catch (e) {
      throw e;
    }
  };
  notify = () => {
    if (!this.state.connected) {
      throw new Error("Not connected");
    }
    const method = this.state.method;
    try {
      const params = JSON.parse(this.state.params);
      this.client
        .notify(method, params)
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
            response: response,
            error: `Error when sending notification: ${response.error.message}`
          }));
        });
    } catch (e) {
      throw e;
    }
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
    if (!this.state.connected) {
      throw new Error("Not connected");
    }
    const method = this.state.method;
    if (this.state.subscriptions.includes(method)) {
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
            if (this.state.subscriptions.length === 1) {
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
          response: response,
          error: response.error.message
        }));
      });
  };
  stopSubscribe = (e) => {
    e.preventDefault();
    const method = this.state.unsubscribe;
    this.client
      .stopSubscribe(method, this.handleSubscriptionUpdates)
      .then((res) => {
        const newSubs = this.state.subscriptions.filter(
          (value) => value !== method
        );
        this.setState(
          (prevState) => ({
            ...prevState,
            submitting: false,
            subscriptions: newSubs
          }),
          () => {
            if (this.state.subscriptions.length === 1) {
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
          response: response,
          error: response.error.message
        }));
      });
  };
  onSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    if (!this.state.request && !this.state.notify && !this.state.subscribe) {
      this.setState((prevState) => ({
        ...prevState,
        error: "Please choose a request type"
      }));
      return;
    }
    try {
      if (this.state.request) {
        this.request();
      } else if (this.state.notify) {
        this.notify();
      } else if (this.state.subscribe) {
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
  buttonPressed = () => {
    this.connect()
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          connected: true,
          submitting: false,
          response: response,
          error: ""
        }));
      })
      .catch((response) => {
        this.setState((prevState) => ({
          ...prevState,
          submitting: false,
          connected: false,
          response: response,
          error: response.error.message
        }));
      });
  };
  handleChange = (e) => {
    const name = e.target.name;
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
    return (
      <div className="container">
        <Form
          state={this.state}
          onSubmit={this.onSubmit}
          handleChange={this.handleChange}
          buttonPressed={this.buttonPressed}
        />
        {this.state.subscriptions.length > 0 ? (
          <CurrentSubscriptions
            subscriptions={this.state.subscriptions}
            stopSubscribe={this.stopSubscribe}
            handleChange={this.handleChange}
          />
        ) : (
          ""
        )}
        {this.state.error && !this.state.submitting ? (
          <ErrorMessage message={this.state.error} />
        ) : (
          ""
        )}
        <Terminal text={this.state.response} />
      </div>
    );
  }
}

export default JsonRpcClient;
