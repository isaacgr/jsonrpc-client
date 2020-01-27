import React from "react";
import { Component } from "react";
import Form from "./Form";
import Client from "../functions/Client";
import ErrorMessage from "./ErrorMessage";
import Terminal from "./Terminal";

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
      method: "",
      params: null,
      response: null
    };
  }
  componentDidMount() {
    this.client = new Client();
    this.client
      .init()
      .then(result => {
        console.log("WS client connected.");
      })
      .catch(response => {
        this.setState(prevState => ({
          ...prevState,
          submitting: false,
          response: response,
          error: response.error.message
        }));
      });
    this.client.serverDisconnected(() => {
      this.setState(prevState => ({
        ...prevState,
        submitting: false,
        subscribing: false,
        connected: false,
        error: "TCP Server disconnected"
      }));
    });
  }
  connect = () => {
    const { host, port, delimiter } = this.state;
    return this.client.connect(host, port, delimiter);
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
        .then(response => {
          this.setState(prevState => ({
            ...prevState,
            submitting: false,
            response: response,
            error: ""
          }));
        })
        .catch(response => {
          console.log(response);
          this.setState(prevState => ({
            ...prevState,
            submitting: false,
            response: response,
            error: response.error.message
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
        .then(response => {
          this.setState(prevState => ({
            ...prevState,
            submitting: false,
            response: response,
            error: ""
          }));
        })
        .catch(response => {
          this.setState(prevState => ({
            ...prevState,
            submitting: false,
            response: response,
            error: response.error.message
          }));
        });
    } catch (e) {
      throw e;
    }
  };
  startSubscribe = () => {
    if (!this.state.connected) {
      throw new Error("Not connected");
    }
    const method = this.state.method;
    this.client
      .startSubscribe(method, (error, message) => {
        if (error) {
          this.setState(prevState => ({
            ...prevState,
            submitting: false,
            error: response.error.message
          }));
        } else {
          this.setState(prevState => ({
            ...prevState,
            submitting: false,
            response: message,
            subscribing: true,
            error: ""
          }));
          console.log(message);
        }
      })
      .catch(response => {
        this.setState(prevState => ({
          ...prevState,
          submitting: false,
          response: response,
          error: response.error.message
        }));
      });
  };
  stopSubscribe = () => {
    this.setState(prevState => ({
      ...prevState,
      submitting: false,
      subscribing: false
    }));
  };
  onSubmit = e => {
    e.preventDefault();
    console.log("Form submitted");
    if (!this.state.request && !this.state.notify && !this.state.subscribe) {
      this.setState(prevState => ({
        ...prevState,
        error: "Please choose a request type"
      }));
      return;
    }
    if (this.state.request) {
      this.request();
    } else if (this.state.notify) {
      this.notify();
    } else if (this.state.subscribe) {
      this.startSubscribe();
    } else {
      return;
    }
    this.setState(prevState => ({
      ...prevState,
      submitting: true,
      error: ""
    }));
  };
  buttonPressed = () => {
    this.connect()
      .then(response => {
        this.setState(prevState => ({
          ...prevState,
          connected: true,
          submitting: false,
          response: response,
          error: ""
        }));
      })
      .catch(response => {
        this.setState(prevState => ({
          ...prevState,
          submitting: false,
          connected: false,
          response: response,
          error: response.error.message
        }));
      });
  };
  handleChange = e => {
    const name = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    switch (name) {
      case "request":
        this.setState(prevState => ({
          ...prevState,
          [name]: value,
          response: null,
          subscribe: false,
          notify: false
        }));
        break;
      case "notify":
        this.setState(prevState => ({
          ...prevState,
          [name]: value,
          request: false,
          response: null,
          subscribe: false
        }));
        break;
      case "subscribe":
        this.setState(prevState => ({
          ...prevState,
          [name]: value,
          request: false,
          response: null,
          notify: false
        }));
        break;
      default:
        this.setState(prevState => ({
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
