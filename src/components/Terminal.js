import React from "react";
import ReactJson from "react-json-view";

const TerminalWrapper = props => {
  let text;
  if (props.text) {
    if (props.text.error) {
      text = JSON.parse(props.text.error.message);
    } else if (props.text.result) {
      if (props.text.result[0].result) {
        text = props.text.result[0];
      } else {
        text = props.text.result[0];
      }
    } else if (props.text.params) {
      text = props.text.params[0];
    } else {
      text = { internalMessage: props.text };
    }
  }
  return (
    <div className="form__section textarea terminal">
      <ReactJson
        src={text}
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

export default TerminalWrapper;
