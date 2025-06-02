import React from 'react';
import Avatar from '../atoms/Avatar';

function UserProfile({ 
  user, 
  size = 'md', 
  showEmail = true, 
  showStatus = true,
  className = '' 
}) {
  if (!user) return null;

  return (
    <div className={`d-flex align-items-center gap-3 ${className}`}>
      <Avatar 
        name={user.name} 
        size={size} 
        showStatus={showStatus} 
      />
      
      <div className="user-info">
        <h4 className="user-name">{user.name}</h4>
        {showEmail && (
          <div className="user-email">
            <span>✉️</span>
            {user.email}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;