import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const DataEntry = ({ method, params, setState, formatJson }) => {
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
        <TextareaAutosize
          placeholder="Params"
          minRows={10}
          style={{ width: "50%" }}
          value={params || ""}
          onChange={(e) =>
            setState((prevState) => ({
              ...prevState,
              params: e.target.value
            }))
          }
        />
        {/* <TextField
          style={{ width: "80%" }}
          rows={10}
          multiline
          label="Params"
          value={params || ""}
          onChange={(e) =>
            setState((prevState) => ({
              ...prevState,
              params: e.target.value
            }))
          }
        /> */}
      </div>
      <Button
        className="button"
        color="secondary"
        variant="outlined"
        value={params}
        onClick={formatJson}
      >
        Prettify
      </Button>
    </div>
  );
};

export default DataEntry;
