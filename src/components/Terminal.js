import React from "react";

const TerminalWrapper = (props) => {
  return (
    <div className="form__section textarea">
      <textarea
        rows="50"
        cols="100"
        disabled
        value={props.text ? JSON.stringify(props.text, null, 2) : ""}
      />
    </div>
  );
};

export default TerminalWrapper;
