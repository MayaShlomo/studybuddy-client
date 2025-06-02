import React from 'react';

const Input = ({ 
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  helperText,
  className = '',
  required = false,
  disabled = false,
  style = {},
  ...props 
}) => {
  const hasError = className.includes('error');
  
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span style={{ color: 'var(--danger)', marginRight: '0.25rem' }}>*</span>}
        </label>
      )}
      
      <div className="position-relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-input ${icon ? 'with-icon' : ''} ${hasError ? 'error' : ''} ${className}`}
          required={required}
          disabled={disabled}
          style={style}
          {...props}
        />
        
        {icon && (
          <span className="input-icon">
            {icon}
          </span>
        )}
      </div>
      
      {helperText && (
        <div 
          className={`${hasError ? 'text-danger' : 'text-muted'}`}
          style={{ 
            fontSize: '0.875rem', 
            marginTop: '0.5rem',
            textAlign: 'right',
            display: 'block'
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Input;