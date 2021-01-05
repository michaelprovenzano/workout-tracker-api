import React from 'react';
import './InputText.styles.scss';

class InputText extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  toggleActive = e => {
    if (e.target.value === '') e.target.classList.toggle('active');
  };

  render() {
    let { name, type, label, value, color, className, onInput, onChange } = this.props;
    if (!className) className = '';
    if (!color) color = 'light';

    return (
      <div className={`input-group input-group-${color} ${className}`}>
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          className={value ? 'active' : null}
          onFocus={this.toggleActive}
          onBlur={this.toggleActive}
          onInput={onInput}
          onChange={onChange}
        />
        <label htmlFor={name}>{label}</label>
      </div>
    );
  }
}

export default InputText;
