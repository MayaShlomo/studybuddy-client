import React from 'react';
import Card from './atoms/Card';
import Button from './atoms/Button';

function GroupCard({ group, onJoin, onView }) {
  const getCategoryIcon = (category) => {
    const icons = {
      'טכנולוגיה': '💻',
      'אמנות ויצירה': '🎨', 
      'ספורט': '🏃‍♂️',
      'לימודים': '📚',
      'מוסיקה': '🎵',
      'בישול': '🍳',
      'נסיעות': '✈️',
      'ספרים': '📖',
      'משחקים': '🎮',
      'עסקים': '💼',
      'בריאות': '🏥',
      'צילום': '📸'
    };
    
    const foundKey = Object.keys(icons).find(key => 
      category.toLowerCase().includes(key.toLowerCase()) || 
      key.toLowerCase().includes(category.toLowerCase())
    );
    
    return icons[foundKey] || '👥';
  };

  const handleJoinClick = () => {
    if (onJoin) {
      onJoin(group.id, group);
    } else {
      if (group.privacy === 'private') {
        alert(`נשלחה בקשת הצטרפות לקבוצה "${group.name}" למנהלים לאישור 📩`);
      } else {
        alert(`הצטרפת לקבוצה "${group.name}" בהצלחה! 🎉`);
      }
    }
  };

  const handleViewClick = () => {
    if (onView) {
      onView(group.id, group);
    } else {
      alert(`מציג פרטים נוספים על "${group.name}"`);
    }
  };

  return (
    <Card className="h-100">
      <div className="group-header">
        <div className="group-icon">
          {getCategoryIcon(group.category)}
        </div>
        <div className="flex-grow-1">
          <h3 className="group-title">{group.name}</h3>
          <div className="d-flex align-items-center gap-2 mt-2">
            <span className="badge bg-primary-subtle text-primary">
              {group.category}
            </span>
            <span className={`badge ${group.privacy === 'private' ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'}`}>
              {group.privacy === 'private' ? '🔒 פרטית' : '🌍 ציבורית'}
            </span>
          </div>
        </div>
      </div>
      
      <p className="group-description">{group.description}</p>
      
      <div className="group-stats">
        <div className="stat-item">
          <span>👥</span>
          <span>{group.memberCount ? group.memberCount.toLocaleString() : '0'} חברים</span>
        </div>
        <div className="stat-item">
          <span>📝</span>
          <span>{group.postCount || 0} פוסטים</span>
        </div>
        <div className="stat-item">
          <span>{group.isActive ? '🟢' : '🟡'}</span>
          <span>{group.isActive ? 'פעיל' : 'בינוני'}</span>
        </div>
      </div>
      
      <div className="d-flex justify-content-between align-items-center">
        <Button 
          variant="primary" 
          onClick={handleJoinClick}
          className="flex-grow-1 me-2">
          <span className="me-2">
            {group.privacy === 'private' ? '📩' : '➕'}
          </span>
          {group.privacy === 'private' ? 'שלח בקשה' : 'הצטרף לקבוצה'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleViewClick}>
          <span className="me-1">👁️</span>
          פרטים
        </Button>
      </div>
    </Card>
  );
}

export default GroupCard;