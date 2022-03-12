import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const DataEntry = ({ method, params, handleChange, formatJson }) => {
  return (
    <div>
      <div className="content-block">
        <TextField
          size="small"
          label="Method"
          value={method}
          onChange={handleChange}
        />
      </div>
      <div className="content-block">
        <TextField
          style={{ width: "80%" }}
          rows={10}
          multiline
          label="Params"
          value={params || ""}
          onChange={handleChange}
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
