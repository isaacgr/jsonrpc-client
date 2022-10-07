import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const CurrentSubscriptions = ({ subscriptions, stopSubscribe }) => {
  const [currentSubscription, setCurrentSubscription] = useState(
    subscriptions[0]
  );
  return (
    <div className="content-block content-block--flex">
      <Autocomplete
        disablePortal
        id="unsubscribe"
        autoSelect
        autoHighlight
        size="small"
        disableClearable
        value={currentSubscription}
        options={subscriptions}
        sx={{ width: 300 }}
        onChange={(e, newValue) => setCurrentSubscription(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Subscribed Methods"
            variant="outlined"
          />
        )}
      />
      <Button
        variant="outlined"
        onClick={() => {
          stopSubscribe(currentSubscription);
          setCurrentSubscription(subscriptions[0]);
        }}
      >
        Stop Subscribing
      </Button>
    </div>
  );
};

CurrentSubscriptions.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  stopSubscribe: PropTypes.func.isRequired
};

export default CurrentSubscriptions;
