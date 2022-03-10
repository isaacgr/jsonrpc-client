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
    <div className="form__section">
      <div>
        <TextField id="host" label="Host" variant="outlined" value={host} />
        <TextField
          id="port"
          type="number"
          label="Port"
          variant="outlined"
          value={port}
        />
        <FormControl>
          <InputLabel id="delimiter-label">Delimiter</InputLabel>
          <Select
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
          id="timeout"
          type="number"
          label="Connection Timeout"
          variant="outlined"
          value={connectionTimeout}
        />
      </div>
      <div className="form__section">
        <Button
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
