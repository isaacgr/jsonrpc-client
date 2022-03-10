import React from "react";
import PropTypes from "prop-types";
import ConnectionOptions from "./FormConnectionOptions";
import DataEntry from "./FormDataEntry";

const Form = ({ state, onSubmit, handleChange, buttonPressed, formatJson }) => (
  <form onSubmit={onSubmit} className="form">
    <ConnectionOptions
      host={state.host}
      port={state.port}
      delimiter={state.delimiter}
      connectionTimeout={state.timeout}
      connected={state.connected}
      handleChange={handleChange}
      buttonPressed={buttonPressed}
    />
    <DataEntry
      method={state.method}
      params={state.params}
      formatJson={formatJson}
      handleChange={handleChange}
    />
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
