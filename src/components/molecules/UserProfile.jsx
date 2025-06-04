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
    <div className={`user-profile ${className}`}>
      <div className="user-info">
        <Avatar 
          name={user.name} 
          size={size} 
          isOnline={showStatus && user.isOnline}
          color={user.avatarColor}
        />
        
        <div className="user-details">
          <h4 className="user-name">{user.name}</h4>
          {showEmail && (
            <div className="user-email">
              <span>✉️</span>
              {user.email}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;