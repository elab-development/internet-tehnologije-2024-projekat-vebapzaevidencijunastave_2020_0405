import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  error,
  className = '',
  required = false,
  disabled = false,
  ...props
}) => {
  const inputClasses = [
    'input',
    error ? 'input-error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-container">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClasses}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input; 