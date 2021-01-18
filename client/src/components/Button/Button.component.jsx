import React from 'react';
import './Button.styles.scss';

const Button = ({ text, position, type, disabled, className, history, targetUrl, onClick }) => (
  <button
    className={`btn btn-${type} btn-${position} ${className ? className : ''}`}
    onClick={() => {
      if (targetUrl && history) history.push(targetUrl);
      if (onClick) onClick();
    }}
    disabled={disabled}
  >
    {text}
  </button>
);

export default Button;
