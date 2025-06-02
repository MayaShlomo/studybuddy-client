import React from 'react';

const Avatar = ({ 
  name,
  size = 'md',
  color,
  isOnline = false,
  src,
  className = '',
  style = {},
  onClick,
  ...props 
}) => {
  // יצירת האותיות הראשיות
  const getInitials = (fullName) => {
    if (!fullName) return '';
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // בניית קלאסים
  const baseClass = 'avatar';
  const sizeClass = size !== 'md' ? `avatar-${size}` : '';
  const onlineClass = isOnline ? 'online' : '';
  
  const classes = [
    baseClass,
    sizeClass,
    onlineClass,
    className
  ].filter(Boolean).join(' ');

  // סגנון מותאם אישית
  const customStyle = {
    ...style,
    ...(color && { background: color }),
    ...(onClick && { cursor: 'pointer' })
  };

  return (
    <div
      className={classes}
      style={customStyle}
      onClick={onClick}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={name} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            borderRadius: '50%'
          }} 
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
};

export default Avatar;