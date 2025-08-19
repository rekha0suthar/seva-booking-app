import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ size = 'medium', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    small: 'loading-small',
    medium: 'loading-medium',
    large: 'loading-large',
  };

  return (
    <div className={`loading-container ${sizeClasses[size]} ${className}`}>
      <div className="loading-spinner"></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

Loading.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  text: PropTypes.string,
  className: PropTypes.string,
};

export default Loading; 