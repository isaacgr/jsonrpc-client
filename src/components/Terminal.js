import React from "react";
import PropTypes from "prop-types";
import Editor from "@monaco-editor/react";

const TerminalWrapper = ({ text }) => {
  let output = null;
  if (text) {
    try {
      if (text.error) {
        output = text;
      } else if (text.result) {
        output = text.result;
      } else if (text.params) {
        output = text.params;
      } else {
        output = { internalMessage: text };
      }
      output = JSON.stringify(output, null, 2);
    } catch (e) {
      if (e instanceof RangeError) {
        try {
          output = JSON.stringify(output);
        } catch (e) {
          output = JSON.stringify({ internalMessage: e.message }, null, 2);
        }
      } else {
        output = JSON.stringify({ internalMessage: e.message }, null, 2);
      }
    }
  }

  return !output ? (
    <div></div>
  ) : (
    <div className="textarea editor">
      <Editor
        theme="vs-dark"
        value={output}
        width="100%"
        height="100%"
        defaultLanguage="json"
        defaultValue=""
        options={{
          domReadOnly: true,
          readOnly: true,
          wordWrap: "wordWrapColumn"
        }}
      />
    </div>
  );
};

TerminalWrapper.propTypes = {
  text: PropTypes.object
};

export default TerminalWrapper;
