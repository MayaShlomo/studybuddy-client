import React from 'react';

const SearchBox = ({ 
  value,
  onChange,
  placeholder = "חפש...",
  icon = "🔍",
  className = '',
  style = {},
  disabled = false,
  ...props 
}) => {
  return (
    <div className="search-wrapper">
      <div className="position-relative">
        <input
          type="text"
          className={`search-input ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={style}
          {...props}
        />
        <span className="search-icon">
          {icon}
        </span>
      </div>
    </div>
  );
};

export default SearchBox;