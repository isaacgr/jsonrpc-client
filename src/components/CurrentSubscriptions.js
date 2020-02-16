import React from "react";

const CurrentSubscriptions = (props) => {
  return (
    <form className="form">
      <div className="form__section">
        <p className="form__label">Currently Subscribed Methods</p>
        <select
          className="form__input"
          name="unsubscribe"
          onChange={props.handleChange}
          defaultValue={props.subscriptions[0]}
        >
          {props.subscriptions.map((sub, idx) => {
            return (
              <option key={sub} value={sub}>
                {sub}
              </option>
            );
          })}
        </select>
        <button role="button" onClick={props.stopSubscribe}>
          Stop Subscribing
        </button>
      </div>
    </form>
  );
};

export default CurrentSubscriptions;
