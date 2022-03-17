import React from "react";
import PropTypes from "prop-types";
import ConnectionOptions from "./FormConnectionOptions";
import DataEntry from "./FormDataEntry";
import FormSelectors from "./FormSelectors";
import Button from "@mui/material/Button";

const Form = ({ state, setState, onSubmit, connect, formatJson }) => (
  <form onSubmit={onSubmit} className="content-block form">
    <ConnectionOptions
      host={state.host}
      port={state.port}
      delimiter={state.delimiter}
      connectionTimeout={state.timeout}
      connected={state.connected}
      setState={setState}
      connect={connect}
    />
    <DataEntry
      method={state.method}
      params={state.params}
      formatJson={formatJson}
      setState={setState}
    />
    <FormSelectors queryType={state.queryType} setState={setState} />
    <Button className="button" disabled={state.submitting} variant="contained">
      Submit
    </Button>
  </form>
);

Form.propTypes = {
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  connect: PropTypes.func.isRequired,
  formatJson: PropTypes.func.isRequired
};

export { Form as default };
