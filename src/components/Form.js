import React from "react";
import PropTypes from "prop-types";

const Form = ({ state, onSubmit, handleChange, buttonPressed, formatJson }) => (
  <form onSubmit={onSubmit} className="form">
    <div className="form__section">
      <label className="form__label">Host</label>
      <input
        type="text"
        name="host"
        value={state.host}
        onChange={handleChange}
        className="form__input"
      />
      <label className="form__label">Port</label>
      <input
        type="number"
        name="port"
        value={state.port}
        onChange={handleChange}
        className="form__input"
      />
      <label className="form__label">Delimiter</label>
      <select
        defaultValue={"\r\n"}
        name="delimiter"
        onChange={handleChange}
        className="form__input"
      >
        <option value={"\r\n"}>\r\n</option>
        <option value={"\n"}>\n</option>
      </select>
      <label className="form__label">Timeout</label>
      <input
        type="number"
        name="timeout"
        value={state.timeout}
        onChange={handleChange}
        className="form__input"
      />
    </div>
    <div className="form__section">
      <button
        className={`form__button ${state.connected ? "connected" : ""}`}
        type="button"
        onClick={buttonPressed}
      >
        Connect
      </button>
    </div>
    <div className="form__section">
      <label className="form__label">Method</label>
      <input
        type="text"
        name="method"
        value={state.method}
        onChange={handleChange}
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
        value={state.params}
        onChange={handleChange}
        className="form__input"
      />
      <button
        type="button"
        value={state.params}
        className="form__button"
        onClick={formatJson}
      >
        Prettify
      </button>
    </div>
    <div className="form__section">
      <label className="form__label">Request</label>
      <input
        type="checkbox"
        name="request"
        checked={state.request}
        value={state.request}
        onChange={handleChange}
        className="form__input"
      />
      <label className="form__label">Notify</label>
      <input
        type="checkbox"
        name="notify"
        checked={state.notify}
        value={state.notify}
        onChange={handleChange}
        className="form__input"
      />
      <label className="form__label">Subscribe</label>
      <input
        type="checkbox"
        name="subscribe"
        checked={state.subscribe}
        value={state.subscribe}
        onChange={handleChange}
        className="form__input"
      />
    </div>
    <div className="form__section">
      <input
        className="form__submit"
        disabled={state.submitting}
        type="submit"
        value="Submit"
      />
    </div>
  </form>
);

Form.propTypes = {
  state: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonPressed: PropTypes.func.isRequired
};

export { Form as default };
