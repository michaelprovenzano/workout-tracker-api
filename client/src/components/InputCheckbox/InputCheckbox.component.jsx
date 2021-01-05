import React from 'react';
import './InputCheckbox.styles.scss';

const InputCheckbox = ({ id, name, checked, label, onChange, className }) => {
  return (
    <div className={`cb-group ${className ? className : ''}`}>
      <input type='checkbox' name={`${name}`} id={`${id}`} checked={checked} onChange={onChange} />
      <span className='cb-checkbox'></span>
      <label htmlFor={`${id}`} className='cb-label'>
        {label}
      </label>
    </div>
  );
};

export default InputCheckbox;
