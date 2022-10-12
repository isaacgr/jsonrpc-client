import React from "react";
import PropTypes from "prop-types";
import Editor from "@monaco-editor/react";

const TerminalWrapper = ({ text }) => {
  let output = null;
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

  return !output ? (
    <div></div>
  ) : (
    <div className="textarea editor">
      <Editor
        theme="vs-dark"
        value={JSON.stringify(output, null, 2)}
        width="100%"
        height="100%"
        defaultLanguage="json"
        defaultValue=""
        options={{ domReadOnly: true, readOnly: true }}
      />
    </div>
  );
};

TerminalWrapper.propTypes = {
  text: PropTypes.object
};

export default TerminalWrapper;
