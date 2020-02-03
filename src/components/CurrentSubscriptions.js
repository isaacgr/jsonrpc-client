import React from "react";

const CurrentSubscriptions = props => {
  return (
    <div>
      <form onSubmit={props.onSubmit}>
        <p className="form__label">Currently Subscribed Methods</p>
        <select
          className="form__input"
          name="subscriptions"
          onChange={props.handleChange}
          multiple
        >
          {props.subscriptions.map(sub => {
            return <option value={sub}>{sub}</option>;
          })}
        </select>
      </form>
    </div>
  );
};

export default CurrentSubscriptions;
