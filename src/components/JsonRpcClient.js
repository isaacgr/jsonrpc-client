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
      port: undefined,
      submitting: false,
      connected: false,
      subscribing: false,
      method: "",
      params: "",
      response: null
    };
  }
  componentDidMount() {
    this.client = new Client();
    this.client
      .init()
      .then((result) => {
        console.log("WS client connected");
      })
      .catch((response) => {
        this.setState((prevState) => ({
          ...prevState,
          submitting: false,
          response: response,
          error: response.error.message
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
        .then((response) => {
          this.setState((prevState) => ({
            ...prevState,
            submitting: false,
            response: response
          }));
        })
        .catch((response) => {
          console.log(response);
          this.setState((prevState) => ({
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
        .notify()
        .send(method, params)
        .then((response) => {
          this.setState((prevState) => ({
            ...prevState,
            submitting: false,
            response: response
          }));
        })
        .catch((response) => {
          this.setState((prevState) => ({
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
    this.client.subscribe(method, (error, message) => {
      if (error) {
        this.setState((prevState) => ({
          ...prevState,
          submitting: false,
          error: response.error.message
        }));
      } else {
        this.setState((prevState) => ({
          ...prevState,
          submitting: false,
          response: message,
          subscribing: true
        }));
        console.log(message);
      }
    });
  };
  stopSubscribe = () => {
    this.setState((prevState) => ({
      ...prevState,
      submitting: false,
      subscribing: false
    }));
  };
  onSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    this.request();
    this.setState((prevState) => ({
      ...prevState,
      submitting: true
    }));
  };
  buttonPressed = () => {
    this.connect()
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          connected: true,
          submitting: false,
          response: response
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
    this.setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
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
