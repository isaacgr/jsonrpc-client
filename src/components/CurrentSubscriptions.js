import React from "react";
import SubscriptionsInput from "./SubscriptionsInput";
import PropTypes from "prop-types";

const CurrentSubscriptions = ({ stopSubscribe, startSubscribe }) => {
  return (
    <div className="content-block">
      <SubscriptionsInput
        startSubscribe={startSubscribe}
        stopSubscribe={stopSubscribe}
        fullWidth
        variant="outlined"
        id="subscriptions"
        name="subscriptions"
        placeholder="Add methods to subscribe to"
        label="Subscriptions"
      />
    </div>
  );
};

CurrentSubscriptions.propTypes = {
  startSubscribe: PropTypes.func.isRequired,
  stopSubscribe: PropTypes.func.isRequired
};

export default CurrentSubscriptions;
