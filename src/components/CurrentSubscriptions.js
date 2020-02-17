import React from 'react';
import PropTypes from 'prop-types';

const CurrentSubscriptions = ({
  handleChange,
  subscriptions,
  stopSubscribe
}) => (
  <form className="form">
    <div className="form__section">
      <p className="form__label">Currently Subscribed Methods</p>
      <select
        className="form__input"
        name="unsubscribe"
        onChange={handleChange}
        defaultValue={subscriptions[0]}
      >
        {subscriptions.map((sub) => (
          <option key={sub} value={sub}>
            {sub}
          </option>
        ))}
      </select>
      <button type="button" onClick={stopSubscribe}>
        Stop Subscribing
      </button>
    </div>
  </form>
);

CurrentSubscriptions.propTypes = {
  handleChange: PropTypes.func.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  stopSubscribe: PropTypes.func.isRequired
};

export default CurrentSubscriptions;
