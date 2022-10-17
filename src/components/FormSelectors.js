import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const FormSelectors = ({ queryType, setState }) => {
  return (
    <FormGroup>
      <div className="content-block content-block--flex">
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  queryType: e.target.checked ? "request" : prevState.queryType
                }))
              }
              checked={queryType === "request"}
            />
          }
          label="Request"
        />
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  queryType: e.target.checked ? "notify" : prevState.queryType
                }))
              }
              checked={queryType === "notify"}
            />
          }
          label="Notify"
        />
        {/* <FormControlLabel
          control={
            <Checkbox
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  queryType: e.target.checked
                    ? "subscribe"
                    : prevState.queryType
                }))
              }
              checked={queryType === "subscribe"}
            />
          }
          label="Subscribe"
        /> */}
      </div>
    </FormGroup>
  );
};

export default FormSelectors;
