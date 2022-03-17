import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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
        <TextField
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
        />
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
