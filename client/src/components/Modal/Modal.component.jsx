import React from 'react';
import './Modal.styles.scss';

const Modal = ({ expanded, children, height, width }) => {
  const style = {};
  if (height) style.height = height;
  if (width) style.width = width;

  return (
    <div className={`modal ${expanded ? 'expanded' : ''}`} style={style}>
      {children}
    </div>
  );
};

export default Modal;
