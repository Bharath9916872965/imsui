import React, { useState } from 'react';
import './CustomTextField.css';

const CustomTextField = ({
  label,
  name,
  rows = 1,
  as = 'input', // Can be 'textarea' or 'input'
  value,
  onChange,
  error = '',
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`custom-textfield ${error ? 'error' : ''}`}>
      {/* {as === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          className="textarea"
          rows={rows}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=" " // Required for floating label
          {...rest}
        />
      ) : ( */}
        <input
          id={name}
          name={name}
          className="textarea"
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=" " // Required for floating label
          {...rest}
        />
      {/* )} */}
      <label
        htmlFor={name}
        className={`textarea-label ${isFocused || value ? 'focused' : ''}`}
      >
        {label}
      </label>
      {error && <div className="error-text">{error}</div>}
    </div>
  );
};

export default CustomTextField;
