import React from 'react';

const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  style = {},
  hover = false,
  ...props 
}) => {
  // בחירת סוג הכרטיס
  const getCardClass = () => {
    switch (variant) {
      case 'glass':
        return 'glass-card';
      case 'solid':
        return 'glass-card-solid';
      case 'user':
        return 'user-card';
      case 'group':
        return 'group-card';
      default:
        return 'glass-card-solid';
    }
  };

  const cardClass = getCardClass();
  const classes = [cardClass, className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;