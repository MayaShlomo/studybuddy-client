/* global $, confirm */
import React, { useState, useEffect, useRef } from 'react';
import SearchBox from '../components/molecules/SearchBox';
import UserCard from '../components/UserCard';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';

function UserSearchPage() {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('הכל');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('activity');
  
  // חיפוש מתקדם - דרישה 20
  const [advancedSearch, setAdvancedSearch] = useState({
    profession: '',
    location: '',
    hasInterests: '',
    mutualFriendsMin: '',
    joinedAfter: '',
    onlineOnly: false
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  // HTML5 Video ref
  const videoRef = useRef(null);

  // נתונים דמיוניים מורחבים עם השדות החדשים - פורום כללי
  const dummyUsers = [
    { 
      id: 1, 
      name: 'מאיה שלמה', 
      nickname: 'מאיושית',
      email: 'maya@example.com',
      profession: 'מורה ליוגה',
      location: 'תל אביב',
      bio: 'אוהבת יוגה, מדיטציה וחיים בריאים. מאמינה שכל יום הוא הזדמנות חדשה להתפתח.',
      isFriend: false,
      isOnline: true,
      joinDate: '2023-01-15',
      lastActive: new Date().toISOString(),
      mutualFriends: 5,
      interests: ['יוגה', 'מדיטציה', 'בישול טבעוני', 'ספרות'],
      avatarColor: '#667eea'
    },
    { 
      id: 2, 
      name: 'יוסף לוי', 
      nickname: 'יוסי השף',
      email: 'yosef@example.com',
      profession: 'שף ובעל מסעדה',
      location: 'חיפה',
      bio: 'שף עם תשוקה לאוכל ים תיכוני. אוהב לשתף מתכונים ולגלות טעמים חדשים.',
      isFriend: true,
      isOnline: false,
      joinDate: '2022-11-20',
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      mutualFriends: 3,
      interests: ['בישול', 'יין', 'נסיעות', 'צילום אוכל'],
      avatarColor: '#f59e0b'
    },
    { 
      id: 3, 
      name: 'דנה כהן', 
      nickname: 'דנה הציירת',
      email: 'dana@example.com',
      profession: 'אמנית ומאיירת',
      location: 'באר שבע',
      bio: 'ציירת שאוהבת לתפוס את היופי בדברים הפשוטים. מלמדת אמנות לילדים.',
      isFriend: false,
      isOnline: true,
      joinDate: '2023-06-01',
      lastActive: new Date().toISOString(),
      mutualFriends: 8,
      interests: ['ציור', 'פיסול', 'צילום', 'טיולים'],
      avatarColor: '#ec4899'
    },
    { 
      id: 4, 
      name: 'אברהם ישראלי', 
      nickname: 'אבי המטייל',
      email: 'avraham@example.com',
      profession: 'מדריך טיולים',
      location: 'ירושלים',
      bio: 'מדריך טיולים עם ניסיון של 15 שנה. אוהב לגלות מקומות חדשים ולשתף טיפים.',
      isFriend: true,
      isOnline: true,
      joinDate: '2022-03-10',
      lastActive: new Date().toISOString(),
      mutualFriends: 12,
      interests: ['טיולים', 'היסטוריה', 'צילום נוף', 'קמפינג'],
      avatarColor: '#10b981'
    },
    { 
      id: 5, 
      name: 'שרה מזרחי', 
      nickname: 'שרה הגיימרית',
      email: 'sarah@example.com',
      profession: 'סטרימרית ויוצרת תוכן',
      location: 'נתניה',
      bio: 'גיימרית נלהבת ויוצרת תוכן. אוהבת לשתף טיפים ולבנות קהילה.',
      isFriend: false,
      isOnline: false,
      joinDate: '2023-09-15',
      lastActive: new Date(Date.now() - 7200000).toISOString(),
      mutualFriends: 2,
      interests: ['גיימינג', 'סטרימינג', 'אנימה', 'טכנולוגיה'],
      avatarColor: '#8b5cf6'
    },
    { 
      id: 6, 
      name: 'רון כהנא', 
      nickname: 'רוני הכדורגלן',
      email: 'ron@example.com',
      profession: 'מאמן כושר אישי',
      location: 'רעננה',
      bio: 'מאמן כושר עם התמחות בספורט קבוצתי. מאמין שספורט הוא דרך חיים.',
      isFriend: false,
      isOnline: true,
      joinDate: '2024-01-01',
      lastActive: new Date().toISOString(),
      mutualFriends: 6,
      interests: ['כדורגל', 'כושר', 'תזונה', 'ריצה'],
      avatarColor: '#06b6d4'
    },
    { 
      id: 7, 
      name: 'נעמי גולדברג', 
      nickname: 'נעמי הסופרת',
      email: 'naomi@example.com',
      profession: 'סופרת ועורכת',
      location: 'רמת גן',
      bio: 'כותבת סיפורים קצרים ורומנים. אוהבת לקרוא ולדון בספרות.',
      isFriend: true,
      isOnline: true,
      joinDate: '2023-05-20',
      lastActive: new Date().toISOString(),
      mutualFriends: 9,
      interests: ['כתיבה', 'קריאה', 'שירה', 'תיאטרון'],
      avatarColor: '#f43f5e'
    },
    { 
      id: 8, 
      name: 'דוד אברמוביץ', 
      nickname: 'דודו המוזיקאי',
      email: 'david@example.com',
      profession: 'מוזיקאי ומלחין',
      location: 'אשדוד',
      bio: 'גיטריסט ומלחין. אוהב ג׳אז, בלוז ומוזיקה ישראלית.',
      isFriend: false,
      isOnline: false,
      joinDate: '2022-12-10',
      lastActive: new Date(Date.now() - 14400000).toISOString(),
      mutualFriends: 4,
      interests: ['גיטרה', 'הלחנה', 'ג׳אז', 'הופעות'],
      avatarColor: '#a855f7'
    },
    { 
      id: 9, 
      name: 'רחל סגל', 
      nickname: 'רחלי הבלוגרית',
      email: 'rachel@example.com',
      profession: 'בלוגרית אופנה',
      location: 'הרצליה',
      bio: 'בלוגרית אופנה וסטייל. משתפת טיפים לסטיילינג ואופנה בת קיימא.',
      isFriend: true,
      isOnline: true,
      joinDate: '2023-08-05',
      lastActive: new Date().toISOString(),
      mutualFriends: 15,
      interests: ['אופנה', 'עיצוב', 'צילום', 'קיימות'],
      avatarColor: '#f97316'
    }
  ];

  useEffect(() => {
    loadUsersWithJQuery();
  }, []);

  // טעינת משתמשים עם jQuery Ajax - דרישה 25
  const loadUsersWithJQuery = () => {
    $.ajax({
      url: '/api/users',
      method: 'GET',
      beforeSend: function() {
        setIsLoading(true);
      },
      success: function(data) {
        // כרגע משתמשים בנתונים דמיוניים
        setTimeout(() => {
          setUsers(dummyUsers);
          setFilteredUsers(dummyUsers);
          setIsLoading(false);
        }, 800);
      },
      error: function(xhr, status, error) {
        console.error('Error loading users:', error);
        // fallback
        setUsers(dummyUsers);
        setFilteredUsers(dummyUsers);
        setIsLoading(false);
      }
    });
  };

  // סינון מתקדם - דרישה 20
  useEffect(() => {
    let filtered = users;

    // סינון לפי סוג
    switch (filterType) {
      case 'חברים':
        filtered = filtered.filter(user => user.isFriend);
        break;
      case 'משתמשים חדשים':
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        filtered = filtered.filter(user => new Date(user.joinDate) > sixMonthsAgo);
        break;
      case 'מחוברים כעת':
        filtered = filtered.filter(user => user.isOnline);
        break;
      default:
        break;
    }

    // סינון לפי חיפוש
    if (query.trim()) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery) ||
        user.profession.toLowerCase().includes(searchQuery) ||
        (user.nickname && user.nickname.toLowerCase().includes(searchQuery))
      );
    }

    // סינון מתקדם - 6 פרמטרים
    if (showAdvancedSearch) {
      // 1. מקצוע
      if (advancedSearch.profession) {
        filtered = filtered.filter(user => 
          user.profession.toLowerCase().includes(advancedSearch.profession.toLowerCase())
        );
      }
      
      // 2. מיקום
      if (advancedSearch.location) {
        filtered = filtered.filter(user => 
          user.location.toLowerCase().includes(advancedSearch.location.toLowerCase())
        );
      }
      
      // 3. תחומי עניין
      if (advancedSearch.hasInterests) {
        filtered = filtered.filter(user => 
          user.interests && user.interests.some(interest => 
            interest.toLowerCase().includes(advancedSearch.hasInterests.toLowerCase())
          )
        );
      }
      
      // 4. חברים משותפים מינימום
      if (advancedSearch.mutualFriendsMin) {
        filtered = filtered.filter(user => 
          user.mutualFriends >= parseInt(advancedSearch.mutualFriendsMin)
        );
      }
      
      // 5. תאריך הצטרפות
      if (advancedSearch.joinedAfter) {
        filtered = filtered.filter(user => 
          new Date(user.joinDate) >= new Date(advancedSearch.joinedAfter)
        );
      }
      
      // 6. מחוברים בלבד
      if (advancedSearch.onlineOnly) {
        filtered = filtered.filter(user => user.isOnline);
      }
    }

    // מיון
    switch (sortBy) {
      case 'activity':
        filtered.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'mutualFriends':
        filtered.sort((a, b) => b.mutualFriends - a.mutualFriends);
        break;
      default:
        break;
    }

    setFilteredUsers(filtered);
  }, [users, query, filterType, sortBy, advancedSearch, showAdvancedSearch]);

  // פעולות CRUD - דרישה 19
  const handleAddFriend = (userId, user) => {
    $.ajax({
      url: `/api/users/${userId}/friend`,
      method: user.isFriend ? 'DELETE' : 'POST',
      success: function(response) {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isFriend: !u.isFriend } : u
        ));
        
        if (user.isFriend) {
          alert(`הסרת את ${user.name} מרשימת החברים`);
        } else {
          alert(`בקשת חברות נשלחה ל-${user.name}`);
        }
      },
      error: function(xhr) {
        alert('שגיאה בביצוע הפעולה');
      }
    });
  };

  const handleUpdateUser = (userId) => {
    // עדכון פרטי משתמש - דרישה 19 Update
    const user = users.find(u => u.id === userId);
    const newProfession = prompt('הכנס מקצוע חדש:', user.profession);
    if (newProfession && newProfession !== user.profession) {
      $.ajax({
        url: `/api/users/${userId}`,
        method: 'PUT',
        data: JSON.stringify({ profession: newProfession }),
        contentType: 'application/json',
        success: function(response) {
          setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, profession: newProfession } : u
          ));
          alert('הפרטים עודכנו בהצלחה!');
        },
        error: function(xhr) {
          alert('שגיאה בעדכון הפרטים');
        }
      });
    }
  };

  const handleDeleteUser = (userId) => {
    // מחיקת משתמש - דרישה 19 Delete (רק אדמין)
    const user = users.find(u => u.id === userId);
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את ${user.name}?`)) {
      $.ajax({
        url: `/api/users/${userId}`,
        method: 'DELETE',
        success: function(response) {
          setUsers(prev => prev.filter(u => u.id !== userId));
          alert('המשתמש נמחק בהצלחה!');
        },
        error: function(xhr) {
          if (xhr.status === 403) {
            alert('אין לך הרשאה למחוק משתמשים');
          } else {
            alert('שגיאה במחיקת המשתמש');
          }
        }
      });
    }
  };

  const handleSendMessage = (userId, user) => {
    // שליחת הודעה עם jQuery
    const message = prompt(`כתוב הודעה ל-${user.name}:`);
    if (message && message.trim()) {
      $.ajax({
        url: `/api/messages`,
        method: 'POST',
        data: JSON.stringify({
          toUserId: userId,
          message: message
        }),
        contentType: 'application/json',
        success: function(response) {
          alert('ההודעה נשלחה בהצלחה!');
        },
        error: function(xhr) {
          alert('שגיאה בשליחת ההודעה');
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="page-background">
          <div className="floating-element floating-element-1"></div>
          <div className="floating-element floating-element-2"></div>
        </div>
        
        <div className="text-center position-relative">
          <div className="spinner-border text-white mb-3"></div>
          <p className="text-white">טוען משתמשים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" dir="rtl">
      
      {/* אלמנטים דקורטיביים ברקע */}
      <div className="page-background">
        <div className="floating-element floating-element-1"></div>
        <div className="floating-element floating-element-2"></div>
        <div className="floating-element floating-element-3"></div>
      </div>

      <div className="container position-relative">
        
        {/* כותרת */}
        <div className="page-header">
          <div className="page-icon">
            <span>👥</span>
          </div>
          <h1 className="page-title">
            מצא חברים חדשים
          </h1>
          <p className="page-subtitle">
            חפש וצור קשר עם אנשים מעניינים בקהילה שלנו
          </p>
          
          {/* HTML5 Video - דרישה 26.i */}
          <div className="mt-3">
            <video 
              ref={videoRef}
              width="400" 
              height="300" 
              controls
              poster="video-poster.jpg"
              style={{ 
                borderRadius: '15px', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                display: 'none' 
              }}>
              <source src="users-intro.mp4" type="video/mp4" />
              <source src="users-intro.webm" type="video/webm" />
              הדפדפן שלך לא תומך בוידאו
            </video>
          </div>
        </div>

        {/* תיבת חיפוש */}
        <div className="row justify-content-center mb-4">
          <div className="col-lg-8">
            <SearchBox
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חפש לפי שם, כינוי, מקצוע או אימייל..."
              icon="🔍"
            />
            
            {/* כפתור חיפוש מתקדם */}
            <div className="text-center mt-3">
              <Button
                variant="outline"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
                <span>🔧</span>
                {showAdvancedSearch ? 'סגור חיפוש מתקדם' : 'חיפוש מתקדם'}
              </Button>
            </div>
          </div>
        </div>

        {/* חיפוש מתקדם - דרישה 20 */}
        {showAdvancedSearch && (
          <div className="row justify-content-center mb-4">
            <div className="col-lg-10">
              <Card variant="glass" className="p-4">
                <h4 className="text-white mb-3">חיפוש מתקדם - 6 פרמטרים</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="text-white mb-1">מקצוע</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="לדוגמה: Developer"
                      value={advancedSearch.profession}
                      onChange={(e) => setAdvancedSearch({
                        ...advancedSearch,
                        profession: e.target.value
                      })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="text-white mb-1">מיקום</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="לדוגמה: תל אביב"
                      value={advancedSearch.location}
                      onChange={(e) => setAdvancedSearch({
                        ...advancedSearch,
                        location: e.target.value
                      })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="text-white mb-1">תחומי עניין</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="לדוגמה: React"
                      value={advancedSearch.hasInterests}
                      onChange={(e) => setAdvancedSearch({
                        ...advancedSearch,
                        hasInterests: e.target.value
                      })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="text-white mb-1">חברים משותפים מינימום</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="לדוגמה: 3"
                      min="0"
                      value={advancedSearch.mutualFriendsMin}
                      onChange={(e) => setAdvancedSearch({
                        ...advancedSearch,
                        mutualFriendsMin: e.target.value
                      })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="text-white mb-1">הצטרף אחרי</label>
                    <input
                      type="date"
                      className="form-input"
                      value={advancedSearch.joinedAfter}
                      onChange={(e) => setAdvancedSearch({
                        ...advancedSearch,
                        joinedAfter: e.target.value
                      })}
                    />
                  </div>
                  <div className="col-md-6 d-flex align-items-end">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="onlineOnly"
                        checked={advancedSearch.onlineOnly}
                        onChange={(e) => setAdvancedSearch({
                          ...advancedSearch,
                          onlineOnly: e.target.checked
                        })}
                      />
                      <label className="form-check-label text-white" htmlFor="onlineOnly">
                        מחוברים בלבד
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* פאנל סינון ומיון */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <Card variant="glass" className="p-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                {/* כפתורי סינון */}
                <div className="filter-buttons-group">
                  {['הכל', 'חברים', 'משתמשים חדשים', 'מחוברים כעת'].map((type) => (
                    <Button
                      key={type}
                      variant={filterType === type ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType(type)}
                      className={`filter-button-compact ${filterType === type ? 'active' : ''}`}>
                      <span>
                        {type === 'הכל' && '👥'} 
                        {type === 'חברים' && '🤝'} 
                        {type === 'משתמשים חדשים' && '✨'} 
                        {type === 'מחוברים כעת' && '🟢'}
                      </span>
                      {type}
                    </Button>
                  ))}
                </div>

                {/* בורר מיון */}
                <select 
                  className="form-select filter-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}>
                  <option value="activity">⚡ הכי פעילים</option>
                  <option value="alphabetical">🔤 לפי א-ב</option>
                  <option value="mutualFriends">👥 חברים משותפים</option>
                </select>
              </div>
            </Card>
          </div>
        </div>

        {/* תוצאות */}
        {filteredUsers.length > 0 ? (
          <>
            {/* מספר תוצאות */}
            <div className="text-center mb-4">
              <p className="loading-text mb-0">
                נמצאו <span className="fw-bold">{filteredUsers.length}</span> משתמשים
              </p>
            </div>
            
            {/* רשימת משתמשים בתצוגת Grid מעודכנת */}
            <div className="users-grid-business">
              {filteredUsers.map((user) => (
                <div key={user.id}>
                  <UserCard
                    user={user}
                    onAddFriend={handleAddFriend}
                    onSendMessage={handleSendMessage}
                    onViewProfile={(userId) => {
                      alert(`מציג פרופיל של ${user.name}`);
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-container">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">
                לא נמצאו משתמשים
              </h3>
              <p className="empty-state-description">
                נסה לחפש במילים אחרות או שנה את הסינון
              </p>
              
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('');
                  setFilterType('הכל');
                  setAdvancedSearch({
                    profession: '',
                    location: '',
                    hasInterests: '',
                    mutualFriendsMin: '',
                    joinedAfter: '',
                    onlineOnly: false
                  });
                  setShowAdvancedSearch(false);
                }}>
                נקה חיפוש
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default UserSearchPage;