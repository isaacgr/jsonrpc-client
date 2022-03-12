import React from "react";
import ReactJson from "react-json-view";
import PropTypes from "prop-types";

const TerminalWrapper = ({ text }) => {
  let output;
  if (text) {
    if (text.error) {
      console.log(text.error.message);
      const errorText = JSON.parse(text.error.message);
      if (typeof errorText === "string") {
        output = { internalMessage: errorText };
      } else {
        output = errorText;
      }
    } else if (text.result) {
      if (text.result[0].result) {
        output = text.result[0];
      } else {
        output = text.result[0];
      }
    } else if (text.params) {
      output = text.params[0];
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
        value={props.text ? JSON.stringify(text, null, 2) : ""}
      /> */}
    </div>
  );
};

TerminalWrapper.propTypes = {
  text: PropTypes.object
};

export default TerminalWrapper;
