import React from 'react';
import UserProfile from './molecules/UserProfile';
import Card from './atoms/Card';
import Button from './atoms/Button';

function UserCard({ user, onAddFriend, onSendMessage, onViewProfile }) {
  
  const handleAddFriend = () => {
    if (onAddFriend) {
      onAddFriend(user.id, user);
    } else {
      if (user.isFriend) {
        alert(`הסרת את ${user.name} מרשימת החברים 💔`);
      } else {
        alert(`נשלחה בקשת חברות ל-${user.name} 👥`);
      }
    }
  };

  const handleSendMessage = () => {
    if (onSendMessage) {
      onSendMessage(user.id, user);
    } else {
      alert(`פותח צ'אט עם ${user.name} 💬`);
    }
  };

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(user.id, user);
    } else {
      alert(`מציג פרופיל של ${user.name}`);
    }
  };

  return (
    <Card variant="user" className="h-100">
      <div className="user-card-content">
        
        {/* פרופיל משתמש */}
        <div className="flex-grow-1">
          <UserProfile 
            user={user} 
            size="lg" 
            showEmail={true}
            showStatus={user.isOnline}
          />
          
          {/* פרטים נוספים */}
          <div className="mt-3">
            {user.profession && (
              <div className="text-primary fw-semibold mb-2">
                💼 {user.profession}
              </div>
            )}
            
            {user.location && (
              <div className="text-secondary mb-2">
                📍 {user.location}
              </div>
            )}
            
            {user.bio && (
              <div className="text-secondary mb-2">
                {user.bio}
              </div>
            )}
            
            {user.mutualFriends > 0 && (
              <div className="text-muted">
                👥 {user.mutualFriends} חברים משותפים
              </div>
            )}
          </div>
        </div>
        
        {/* סטטוס חיבור */}
        <div className="text-right mb-3">
          <span className={`badge ${user.isOnline ? 'bg-success' : 'bg-secondary'} text-white`}>
            {user.isOnline ? '🟢 מחובר' : '⚫ לא מחובר'}
          </span>
        </div>
      </div>
      
      {/* תחומי עניין */}
      {user.interests && user.interests.length > 0 && (
        <div className="mt-3">
          <div className="d-flex gap-1 flex-wrap">
            {user.interests.slice(0, 3).map((interest, index) => (
              <span 
                key={index}
                className="badge bg-light text-primary">
                {interest}
              </span>
            ))}
            {user.interests.length > 3 && (
              <span className="badge bg-light text-muted">
                +{user.interests.length - 3}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* כפתורי פעולה */}
      <div className="d-flex gap-2 mt-3">
        <Button 
          variant={user.isFriend ? "secondary" : "primary"} 
          size="sm"
          onClick={handleAddFriend}
          className="flex-grow-1">
          <span>{user.isFriend ? '👥' : '➕'}</span>
          {user.isFriend ? 'חבר' : 'הוסף חבר'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleSendMessage}>
          <span>💬</span>
          הודעה
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleViewProfile}>
          <span>👤</span>
          פרופיל
        </Button>
      </div>
    </Card>
  );
}

export default UserCard;