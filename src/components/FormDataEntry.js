import React, { useRef } from "react";
import TextField from "@mui/material/TextField";
import Editor from "@monaco-editor/react";
import { formatJson } from "../utils/utils";

const DataEntry = ({ method, params, setState }) => {
  const monacoRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    monacoRef.current = editor;
    const jsonDefaults = monaco.languages.json.jsonDefaults;
    jsonDefaults.setModeConfiguration({
      ...jsonDefaults.modeConfiguration,
      documentFormattingEdits: false,
      documentRangeFormattingEdits: false
    });
    monaco.languages.registerDocumentFormattingEditProvider("json", {
      provideDocumentFormattingEdits: function (model, options, token) {
        return [
          {
            text: formatJson(model.getValue()),
            range: model.getFullModelRange()
          }
        ];
      }
    });
  };
  return (
    <div>
      <div className="content-block">
        <TextField
          size="small"
          label="Method"
          value={method}
          onChange={(e) =>
            setState((prevState) => ({
              ...prevState,
              method: e.target.value
            }))
          }
        />
      </div>
      <div className="content-block">
        <Editor
          className="params-editor"
          onChange={(value, e) =>
            setState((prevState) => ({
              ...prevState,
              params: value || null
            }))
          }
          value={params || ""}
          width="50%"
          height="100%"
          defaultLanguage="json"
          defaultValue=""
          theme="vs-dark"
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
};

export default DataEntry;
