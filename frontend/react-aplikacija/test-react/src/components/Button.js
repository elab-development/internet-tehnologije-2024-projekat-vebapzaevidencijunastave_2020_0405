import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'button-secondary';
      case 'success':
        return 'button-success';
      case 'danger':
        return 'button-danger';
      case 'primary':
      default:
        return 'button-primary';
    }
  };

  const buttonClasses = [
    'button',
    getVariantClass(),
    `button-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 