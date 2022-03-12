import React from "react";
import PropTypes from "prop-types";
import ConnectionOptions from "./FormConnectionOptions";
import DataEntry from "./FormDataEntry";
import FormSelectors from "./FormSelectors";
import Button from "@mui/material/Button";

const Form = ({ state, onSubmit, handleChange, buttonPressed, formatJson }) => (
  <form onSubmit={onSubmit} className="content-block form">
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
    <FormSelectors
      request={state.request}
      notify={state.notify}
      subscribe={state.subscribe}
      handleChange={handleChange}
    />
    <Button className="button" disabled={state.submitting} variant="contained">
      Submit
    </Button>
  </form>
);

Form.propTypes = {
  state: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonPressed: PropTypes.func.isRequired
};

export { Form as default };
