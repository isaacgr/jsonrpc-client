import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ message }) => (
  <div>
    <p className="error-message">{message}</p>
  </div>
);

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
};

export default ErrorMessage;
