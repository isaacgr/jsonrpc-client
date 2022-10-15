import React from "react";
import PropTypes from "prop-types";
import ConnectionOptions from "./FormConnectionOptions";
import DataEntry from "./FormDataEntry";
import FormSelectors from "./FormSelectors";
import Submit from "./Submit";

const Form = ({ state, setState, onSubmit, connect, disconnect }) => (
  <form onSubmit={onSubmit} className="content-block form">
    <ConnectionOptions
      host={state.host}
      port={state.port}
      connectedHost={state.connectedHost}
      delimiter={state.delimiter}
      responseTimeout={state.timeout}
      connected={state.connected}
      setState={setState}
      connect={connect}
      disconnect={disconnect}
    />
    <FormSelectors queryType={state.queryType} setState={setState} />
    <DataEntry
      method={state.method}
      params={state.params}
      setState={setState}
    />
    <Submit
      result={state.response}
      error={state.error}
      submitting={state.submitting}
    />
  </form>
);

Form.propTypes = {
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  connect: PropTypes.func.isRequired
};

export { Form as default };
