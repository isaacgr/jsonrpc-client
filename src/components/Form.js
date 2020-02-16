import React from "react";

const Form = props => {
  return (
    <form onSubmit={props.onSubmit} className="form">
      <div className="form__section">
        <label className="form__label">Host</label>
        <input
          type="text"
          name="host"
          value={props.state.host}
          onChange={props.handleChange}
          className="form__input"
        />
        <label className="form__label">Port</label>
        <input
          type="number"
          name="port"
          value={props.state.port}
          onChange={props.handleChange}
          className="form__input"
        />
        <label className="form__label">Delimiter</label>
        <select
          defaultValue={"\r\n"}
          name="delimiter"
          onChange={props.handleChange}
          className="form__input"
        >
          <option value={"\r\n"}>\r\n</option>
          <option value={"\n"}>\n</option>
        </select>
        <label className="form__label">Timeout</label>
        <input
          type="number"
          name="timeout"
          value={props.state.timeout}
          onChange={props.handleChange}
          className="form__input"
        />
      </div>
      <div className="form__section">
        <button
          className={`form__button ${props.state.connected ? "connected" : ""}`}
          type="button"
          onClick={props.buttonPressed}
        >
          Connect
        </button>
      </div>
      <div className="form__section">
        <label className="form__label">Method</label>
        <input
          type="text"
          name="method"
          value={props.state.method}
          onChange={props.handleChange}
          className="form__input"
        />
      </div>
      <div className="form__section textarea">
        <label className="form__label">Params</label>
        <textarea
          type="text"
          name="params"
          rows="10"
          cols="100"
          value={props.state.params}
          onChange={props.handleChange}
          className="form__input"
        />
      </div>
      <div className="form__section">
        <label className="form__label">Request</label>
        <input
          type="checkbox"
          name="request"
          checked={props.state.request}
          value={props.state.request}
          onChange={props.handleChange}
          className="form__input"
        />
        <label className="form__label">Notify</label>
        <input
          type="checkbox"
          name="notify"
          checked={props.state.notify}
          value={props.state.notify}
          onChange={props.handleChange}
          className="form__input"
        />
        <label className="form__label">Subscribe</label>
        <input
          type="checkbox"
          name="subscribe"
          checked={props.state.subscribe}
          value={props.state.subscribe}
          onChange={props.handleChange}
          className="form__input"
        />
      </div>
      <div className="form__section">
        <input
          className="form__submit"
          disabled={props.state.submitting}
          type="submit"
          value="Submit"
        />
      </div>
    </form>
  );
};

export { Form as default };
