import React from 'react';
import UserProfile from './molecules/UserProfile';
import Card from './atoms/Card';
import Button from './atoms/Button';

function UserCard({ user, onAddFriend, onSendMessage, onViewProfile }) {
  
  const handleAddFriend = () => {
    if (onAddFriend) {
      onAddFriend(user.id, user);
    }
  };

  const handleSendMessage = () => {
    if (onSendMessage) {
      onSendMessage(user.id, user);
    }
  };

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(user.id, user);
    }
  };

  return (
    <Card variant="user" className="business-card">
      {/* חלק עליון - פרופיל ופרטים אישיים */}
      <div className="card-header-section">
        <UserProfile 
          user={user} 
          size="lg"
          showEmail={false}
          showStatus={true}
          className="mb-3"
        />
        
        {/* כינוי */}
        {user.nickname && (
          <p className="user-nickname">"{user.nickname}"</p>
        )}
        
        {/* מקצוע */}
        {user.profession && (
          <p className="user-profession-badge">
            <span className="icon">💼</span>
            {user.profession}
          </p>
        )}
      </div>

      {/* קו מפריד דקורטיבי */}
      <div className="divider-decorative">
        <span className="divider-icon">✦</span>
      </div>

      {/* תיאור אישי */}
      {user.bio && (
        <div className="bio-section">
          <p className="bio-text">{user.bio}</p>
        </div>
      )}

      {/* פרטי קשר ומיקום */}
      <div className="contact-info">
        {user.email && (
          <div className="info-item">
            <span className="info-icon">✉️</span>
            <span className="info-text">{user.email}</span>
          </div>
        )}
        
        {user.location && (
          <div className="info-item">
            <span className="info-icon">📍</span>
            <span className="info-text">{user.location}</span>
          </div>
        )}
        
        {user.mutualFriends > 0 && (
          <div className="info-item">
            <span className="info-icon">👥</span>
            <span className="info-text">{user.mutualFriends} חברים משותפים</span>
          </div>
        )}
      </div>

      {/* תחומי עניין */}
      {user.interests && user.interests.length > 0 && (
        <div className="interests-section">
          <h6 className="section-label">תחומי התמחות</h6>
          <div className="interests-tags">
            {user.interests.map((interest, index) => (
              <span key={index} className="interest-chip">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* כפתורי פעולה */}
      <div className="card-actions">
        <Button 
          variant={user.isFriend ? "secondary" : "primary"} 
          size="sm"
          onClick={handleAddFriend}
          className="flex-grow-1">
          {user.isFriend ? '✓ חברים' : '+ הוסף חבר'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleSendMessage}>
          💬
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleViewProfile}>
          👤
        </Button>
      </div>
    </Card>
  );
}

export default UserCard;