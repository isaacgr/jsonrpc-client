import React from "react";
import ReactJson from "react-json-view";
import PropTypes from "prop-types";

const TerminalWrapper = ({ text }) => {
  let output;
  if (text) {
    if (text.error) {
      output = text;
    } else if (text.result) {
      output = text.result;
    } else if (text.params) {
      output = text.params;
    } else {
      output = { internalMessage: text };
    }
  }
  return (
    <div className="textarea terminal">
      <ReactJson
        src={output}
        displayDataTypes={false}
        theme="solarized"
        name={false}
        displayObjectSize={false}
      />
      {/* <textarea
        rows="50"
        cols="100"
        disabled
        value={output ? JSON.stringify(output, null, 2) : ""}
      /> */}
    </div>
  );
};

TerminalWrapper.propTypes = {
  text: PropTypes.object
};

export default TerminalWrapper;
