import React from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

const ConnectionOptions = ({
  host,
  port,
  connectedHost,
  delimiter,
  responseTimeout,
  connected,
  setState,
  connect,
  disconnect
}) => {
  return (
    <div className="content-block ">
      <div className="content-block content-block--flex">
        <TextField
          autoComplete="on"
          size="small"
          id="host"
          label="Host"
          variant="outlined"
          value={host}
          onChange={(e) =>
            setState((prevState) => ({
              ...prevState,
              host: e.target.value
            }))
          }
        />
        <TextField
          size="small"
          id="port"
          type="number"
          label="Port"
          variant="outlined"
          // value={port}
          onChange={(e) =>
            setState((prevState) => ({
              ...prevState,
              port: e.target.value
            }))
          }
        />
        <FormControl>
          <InputLabel id="delimiter-label">Delimiter</InputLabel>
          <Select
            size="small"
            labelId="delimiter-label"
            id="delimiter"
            value={delimiter}
            label="Delimiter"
            onChange={(e) =>
              setState((prevState) => ({
                ...prevState,
                delimiter: e.target.value
              }))
            }
          >
            <MenuItem value={"\r\n"}>\r\n</MenuItem>
            <MenuItem value={"\n"}>\n</MenuItem>
            <MenuItem value={"\r"}>\r</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          id="timeout"
          type="number"
          label="Response Timeout"
          variant="outlined"
          value={responseTimeout}
          onChange={(e) =>
            setState((prevState) => ({
              ...prevState,
              timeout: e.target.value
            }))
          }
        />
      </div>
      <div className="content-block">
        <Chip
          label={connected ? `Connected to ${connectedHost}` : "Not connected"}
          variant="outlined"
          color={connected ? "success" : "default"}
        />
      </div>
      <div className="content-block">
        <Button
          className="button"
          disabled={connected ? true : false}
          variant="contained"
          onClick={connect}
        >
          Connect
        </Button>
        <Button
          className="button"
          disabled={!connected ? true : false}
          variant="contained"
          onClick={disconnect}
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
};

export default ConnectionOptions;
