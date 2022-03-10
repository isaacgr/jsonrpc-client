import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const DataEntry = ({ method, params, handleChange, formatJson }) => {
  return (
    <div>
      <div className="form__section">
        <TextField label="Method" value={method} onChange={handleChange} />
      </div>
      <div className="form__section textarea">
        <TextField
          style={{ width: "100%" }}
          rows={10}
          multiline
          label="Params"
          value={params}
          onChange={handleChange}
        />
        <Button
          type="button"
          variant="contained"
          value={params}
          onClick={formatJson}
        >
          Prettify
        </Button>
      </div>
    </div>
  );
};

export default DataEntry;
