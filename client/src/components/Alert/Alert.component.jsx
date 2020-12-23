import React from 'react';
import './Alert.styles.scss';

const Alert = ({ message, type }) => {
  return <div className={`alert alert-${type} slide-in`}>{message}</div>;
};

export default Alert;
