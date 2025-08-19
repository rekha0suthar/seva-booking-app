import React from 'react';
import PropTypes from 'prop-types';

const Error = ({ 
  message, 
  onRetry, 
  className = '', 
  showRetry = true 
}) => {
  return (
    <div className={`error-container ${className}`}>
      <div className="error-icon">⚠️</div>
      <p className="error-message">{message}</p>
      {showRetry && onRetry && (
        <button onClick={onRetry} className="error-retry-btn">
          Try Again
        </button>
      )}
    </div>
  );
};

Error.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
  className: PropTypes.string,
  showRetry: PropTypes.bool,
};

export default Error; 