import React from 'react';

const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  className = '',
  style = {},
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = `btn-${variant}`;

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${disabled || loading ? 'btn-disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      {...props}
    >
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : 18} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
