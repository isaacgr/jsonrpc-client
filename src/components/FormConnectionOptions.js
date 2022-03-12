import React from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

const ConnectionOptions = ({
  host,
  port,
  delimiter,
  connectionTimeout,
  connected,
  handleChange,
  buttonPressed
}) => {
  return (
    <div className="content-block ">
      <div className="content-block content-block--flex">
        <TextField
          size="small"
          id="host"
          label="Host"
          variant="outlined"
          value={host}
        />
        <TextField
          size="small"
          id="port"
          type="number"
          label="Port"
          variant="outlined"
          value={port}
        />
        <FormControl>
          <InputLabel id="delimiter-label">Delimiter</InputLabel>
          <Select
            size="small"
            labelId="delimiter-label"
            id="delimiter"
            value={delimiter}
            label="Delimiter"
            onChange={handleChange}
          >
            <MenuItem value={"\r\n"}>\r\n</MenuItem>
            <MenuItem value={"\n"}>\n</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          id="timeout"
          type="number"
          label="Connection Timeout"
          variant="outlined"
          value={connectionTimeout}
        />
      </div>
      <div className="content-block">
        <Button
          classname="button"
          variant="outlined"
          color={connected ? "success" : "primary"}
          onClick={buttonPressed}
        >
          Connect
        </Button>
      </div>
    </div>
  );
};

export default ConnectionOptions;
