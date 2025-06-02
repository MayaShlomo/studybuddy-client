import React, { useState, useEffect } from 'react';
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

  // נתונים דמיוניים מורחבים
  const dummyUsers = [
    { 
      id: 1, 
      name: 'מאיה שלמה', 
      email: 'maya@example.com',
      profession: 'Full Stack Developer',
      location: 'תל אביב',
      bio: 'מפתחת full stack עם ניסיון של 5 שנים ב-React ו-Node.js',
      isFriend: false,
      isOnline: true,
      joinDate: '2023-01-15',
      lastActive: new Date().toISOString(),
      mutualFriends: 5,
      interests: ['React', 'Node.js', 'UI/UX']
    },
    { 
      id: 2, 
      name: 'ישראל פלד', 
      email: 'israel@example.com',
      profession: 'Product Manager',
      location: 'הרצליה',
      bio: 'מנהל מוצר בסטארט-אפ טכנולוגי',
      isFriend: true,
      isOnline: false,
      joinDate: '2022-08-20',
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      mutualFriends: 12,
      interests: ['Product', 'StartUp', 'Analytics']
    },
    { 
      id: 3, 
      name: 'נועה כהן', 
      email: 'noa@example.com',
      profession: 'UX Designer',
      location: 'תל אביב',
      bio: 'מעצבת חוויית משתמש',
      isFriend: false,
      isOnline: true,
      joinDate: '2023-03-10',
      lastActive: new Date().toISOString(),
      mutualFriends: 3,
      interests: ['UX Design', 'Figma']
    },
    { 
      id: 4, 
      name: 'דני רוזן', 
      email: 'danny@example.com',
      profession: 'Android Developer',
      location: 'חיפה',
      bio: 'מפתח אפליקציות אנדרואיד',
      isFriend: false,
      isOnline: true,
      joinDate: '2023-06-05',
      lastActive: new Date().toISOString(),
      mutualFriends: 2,
      interests: ['Android', 'Kotlin']
    },
    { 
      id: 5, 
      name: 'שירה לוי', 
      email: 'shira@example.com',
      profession: 'UI Designer',
      location: 'רעננה',
      bio: 'מעצבת ממשק משתמש',
      isFriend: true,
      isOnline: false,
      joinDate: '2022-11-12',
      lastActive: new Date(Date.now() - 7200000).toISOString(),
      mutualFriends: 8,
      interests: ['UI Design', 'Animation']
    },
    {
      id: 6,
      name: 'עמית גולן',
      email: 'amit@example.com',
      profession: 'Data Scientist',
      location: 'ירושלים',
      bio: 'מדען נתונים המתמחה בלמידת מכונה ובינה מלאכותית',
      isFriend: false,
      isOnline: true,
      joinDate: '2023-02-28',
      lastActive: new Date().toISOString(),
      mutualFriends: 1,
      interests: ['Machine Learning', 'Python', 'AI']
    },
    {
      id: 7,
      name: 'רונית אברהם',
      email: 'ronit@example.com',
      profession: 'Marketing Manager',
      location: 'פתח תקווה',
      bio: 'מנהלת שיווק דיגיטלי עם התמחות ברשתות חברתיות',
      isFriend: false,
      isOnline: false,
      joinDate: '2023-07-18',
      lastActive: new Date(Date.now() - 86400000).toISOString(),
      mutualFriends: 0,
      interests: ['Digital Marketing', 'Social Media']
    },
    {
      id: 8,
      name: 'יוסי כהן',
      email: 'yossi@example.com',
      profession: 'Backend Developer',
      location: 'באר שבע',
      bio: 'מפתח backend עם התמחות ב-Node.js ו-MongoDB',
      isFriend: true,
      isOnline: true,
      joinDate: '2022-10-10',
      lastActive: new Date().toISOString(),
      mutualFriends: 7,
      interests: ['Node.js', 'MongoDB', 'API Design']
    },
    {
      id: 9,
      name: 'טל ברק',
      email: 'tal@example.com',
      profession: 'Graphic Designer',
      location: 'נתניה',
      bio: 'מעצבת גרפית עם ניסיון בעיצוב דיגיטלי ומיתוג',
      isFriend: false,
      isOnline: true,
      joinDate: '2023-05-22',
      lastActive: new Date().toISOString(),
      mutualFriends: 4,
      interests: ['Photoshop', 'Illustrator', 'Branding']
    },
    {
      id: 10,
      name: 'אורי שפירא',
      email: 'ori@example.com',
      profession: 'DevOps Engineer',
      location: 'ראשון לציון',
      bio: 'מהנדס DevOps עם התמחות ב-Docker ו-Kubernetes',
      isFriend: false,
      isOnline: false,
      joinDate: '2023-04-15',
      lastActive: new Date(Date.now() - 10800000).toISOString(),
      mutualFriends: 6,
      interests: ['Docker', 'Kubernetes', 'CI/CD']
    }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers(dummyUsers);
      setFilteredUsers(dummyUsers);
      setIsLoading(false);
    }, 800);
  };

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
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.profession.toLowerCase().includes(query.toLowerCase())
      );
    }

    // מיון
    switch (sortBy) {
      case 'activity':
        filtered.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredUsers(filtered);
  }, [users, query, filterType, sortBy]);

  const handleAddFriend = (userId, user) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isFriend: !u.isFriend } : u
    ));
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
        </div>

        {/* תיבת חיפוש */}
        <div className="row justify-content-center mb-4">
          <div className="col-lg-8">
            <SearchBox
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חפש לפי שם, מקצוע או אימייל..."
              icon="🔍"
            />
          </div>
        </div>

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
            
            {/* רשימת משתמשים בגריד */}
            <div className="users-grid-container">
              <div className="users-grid">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onAddFriend={handleAddFriend}
                  />
                ))}
              </div>
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
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default UserSearchPage;