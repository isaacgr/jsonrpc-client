import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const FormSelectors = ({ request, notify, subscribe, handleChange }) => {
  return (
    <FormGroup>
      <div className="content-block content-block--flex">
        <FormControlLabel
          control={<Checkbox onChange={handleChange} checked={request} />}
          label="Request"
        />
        <FormControlLabel
          control={<Checkbox onChange={handleChange} checked={notify} />}
          label="Notify"
        />
        <FormControlLabel
          control={<Checkbox onChange={handleChange} checked={subscribe} />}
          label="Subscribe"
        />
      </div>
    </FormGroup>
  );
};

export default FormSelectors;
