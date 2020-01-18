import React from "react";
import { Component } from "react";
import Form from "./Form";
import Client from "../functions/Client";
import ErrorMessage from "./ErrorMessage";

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
      params: "[]"
    };
  }
  connect = () => {
    this.client = new Client(
      this.state.host,
      this.state.port,
      this.state.delimiter
    );
    return this.client.connect();
  };
  request = () => {
    if (!this.state.connected) {
      throw new Error("Not connected");
    }
    const method = this.state.method;
    try {
      const params = JSON.parse(this.state.params);
      this.client
        .request()
        .send(method, params)
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          this.setState(prevState => ({
            ...prevState,
            submitting: false,
            error: error
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
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          this.setState(prevState => ({
            ...prevState,
            submitting: false,
            error: error
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
        this.setState(prevState => ({
          ...prevState,
          submitting: false,
          error: error
        }));
      } else {
        this.setState(prevState => ({
          ...prevState,
          submitting: false,
          subscribing: true
        }));
        console.log(message);
      }
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
    this.request();
    this.setState(prevState => ({
      ...prevState,
      submitting: true
    }));
  };
  buttonPressed = () => {
    this.connect()
      .then(result => {
        console.log(`Connected. ${result}`);
        this.setState(prevState => ({
          ...prevState,
          submitting: false,
          connected: true
        }));
      })
      .catch(error => {
        this.setState(prevState => ({
          ...prevState,
          submitting: false,
          error: error
        }));
      });
  };
  handleChange = e => {
    const name = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.setState(prevState => ({
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
      </div>
    );
  }
}

export default JsonRpcClient;
