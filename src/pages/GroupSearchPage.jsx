import React, { useState, useEffect, useCallback } from 'react';
import SearchBox from '../components/molecules/SearchBox';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';

function GroupSearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');

  // קטגוריות לסינון
  const categories = [
    'הכל',
    '💻 טכנולוגיה', 
    '🎨 אמנות ויצירה',
    '⚽ ספורט',
    '📚 לימודים',
    '🎵 מוסיקה',
    '🍳 בישול',
    '✈️ נסיעות',
    '📖 ספרים',
    '🎮 משחקים',
    '💼 עסקים',
    '🧘 בריאות ורווחה',
  ];

  // נתונים דמיוניים מורחבים
  const dummyGroups = [
    {
      id: 1,
      name: 'מפתחי React ישראל',
      description: 'קהילת מפתחים המתמחים ב-React, Next.js ו-JavaScript מודרני. שיתוף ידע, עזרה הדדית ופרויקטים משותפים',
      category: 'טכנולוגיה',
      privacy: 'public',
      memberCount: 1250,
      postCount: 347,
      isActive: true,
      createdAt: '2023-01-15',
      icon: '⚛️',
      isHot: true,
      activity: 'גבוהה',
      recentPosts: ['פתרון בעיות ב-React Hooks', 'טיפים לאופטימיזציה', 'פרויקט חדש ב-Next.js']
    },
    {
      id: 2,
      name: 'צילום נוף ישראלי',
      description: 'קבוצת צלמים המתמחים בצילום נופי ישראל. שיתוף תמונות, טכניקות וטיפים לצילום בטבע',
      category: 'אמנות ויצירה',
      privacy: 'public',
      memberCount: 892,
      postCount: 1056,
      isActive: true,
      createdAt: '2022-08-20',
      icon: '📸',
      isHot: false,
      activity: 'בינונית',
      recentPosts: ['זריחה בים המלח', 'צילום לילה במכתש רמון', 'עריכת תמונות בלייטרום']
    },
    {
      id: 3,
      name: 'קבוצת ריצה תל אביב',
      description: 'קבוצה לאוהבי ריצה במרכז. מפגשי ריצה קבוצתיים, אימונים ותחרויות',
      category: 'ספורט',
      privacy: 'public',
      memberCount: 456,
      postCount: 234,
      isActive: true,
      createdAt: '2023-03-10',
      icon: '🏃‍♂️',
      isHot: true,
      activity: 'גבוהה',
      recentPosts: ['מפגש ריצה יום ראשון', 'טיפים להתאוששות', 'מרתון תל אביב 2024']
    },
    {
      id: 4,
      name: 'סטארט-אפ ונצ׳רז',
      description: 'רשת יזמים וחדשנות. רעיונות, השקעות ושותפויות עסקיות בעולם הסטארט-אפ',
      category: 'עסקים',
      privacy: 'private',
      memberCount: 289,
      postCount: 167,
      isActive: true,
      createdAt: '2023-06-05',
      icon: '🚀',
      isHot: false,
      activity: 'בינונית',
      recentPosts: ['הזדמנויות השקעה חדשות', 'פיצ׳ פרויקטים', 'רשת קשרים']
    },
    {
      id: 5,
      name: 'בישול ביתי מתקדם',
      description: 'מתכונים, טכניקות בישול מתקדמות ושיתוף חוויות קולינריות. מהמטבח הביתי לרמה מקצועית',
      category: 'בישול',
      privacy: 'public',
      memberCount: 678,
      postCount: 523,
      isActive: true,
      createdAt: '2022-11-12',
      icon: '👨‍🍳',
      isHot: true,
      activity: 'גבוהה',
      recentPosts: ['מתכון לפסטה טעימה', 'טכניקות מתקדמות', 'תחרות בישול']
    },
    {
      id: 6,
      name: 'קבוצת קריאה',
      description: 'מועדון קריאה וירטואלי. המלצות על ספרים, דיונים ומפגשי סופרים',
      category: 'ספרים',
      privacy: 'public',
      memberCount: 334,
      postCount: 189,
      isActive: true,
      createdAt: '2023-02-28',
      icon: '📚',
      isHot: false,
      activity: 'נמוכה',
      recentPosts: ['ספר החודש', 'דיון על רומן חדש', 'מפגש עם סופר']
    },
    {
      id: 7,
      name: 'גיימרים ישראל',
      description: 'קהילת גיימרים ישראלית. טורנירים, ביקורות משחקים ושיתופי פעולה',
      category: 'משחקים',
      privacy: 'public',
      memberCount: 2103,
      postCount: 892,
      isActive: true,
      createdAt: '2022-06-15',
      icon: '🎮',
      isHot: true,
      activity: 'גבוהה מאוד',
      recentPosts: ['טורניר CS2', 'ביקורת על המשחק החדש', 'לייב סטרים']
    },
    {
      id: 8,
      name: 'מוזיקה אלקטרונית',
      description: 'חובבי מוזיקה אלקטרונית, DJ ומפיקים. שיתוף יצירות, טיפים והפקות',
      category: 'מוסיקה',
      privacy: 'public',
      memberCount: 567,
      postCount: 412,
      isActive: true,
      createdAt: '2023-04-10',
      icon: '🎧',
      isHot: false,
      activity: 'בינונית',
      recentPosts: ['מיקס חדש', 'טיפים להפקה', 'אירועים השבוע']
    },
    {
      id: 9,
      name: 'טיולים בעולם',
      description: 'חוויות מטיולים, המלצות על יעדים, טיפים לטיסות זולות ומסלולים מומלצים',
      category: 'נסיעות',
      privacy: 'public',
      memberCount: 1567,
      postCount: 723,
      isActive: true,
      createdAt: '2022-09-20',
      icon: '🌍',
      isHot: true,
      activity: 'גבוהה',
      recentPosts: ['יעדים ל-2024', 'טיסות זולות', 'המלצות מלונות']
    },
    {
      id: 10,
      name: 'Python Developers IL',
      description: 'קהילת מפתחי Python. למידת מכונה, אוטומציה ופיתוח web עם Django ו-Flask',
      category: 'טכנולוגיה',
      privacy: 'public',
      memberCount: 983,
      postCount: 456,
      isActive: true,
      createdAt: '2023-01-08',
      icon: '🐍',
      isHot: false,
      activity: 'בינונית',
      recentPosts: ['מדריך Django', 'פרויקט AI חדש', 'סדנת מכונה']
    }
  ];

  const loadGroups = useCallback(async () => {
    setIsLoading(true);
    setTimeout(() => {
      setGroups(dummyGroups);
      setFilteredGroups(dummyGroups);
      setIsLoading(false);
    }, 1200);
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  useEffect(() => {
    let filtered = groups;

    // סינון לפי קטגוריה
    if (selectedCategory !== 'הכל') {
      const categoryName = selectedCategory.split(' ')[1];
      filtered = filtered.filter(group => 
        group.category === categoryName || 
        group.category === selectedCategory
      );
    }

    // סינון לפי חיפוש
    if (query.trim()) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(query.toLowerCase()) ||
        group.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // מיון
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.memberCount - a.memberCount);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'active':
        filtered.sort((a, b) => b.postCount - a.postCount);
        break;
      default:
        break;
    }

    setFilteredGroups(filtered);
  }, [groups, query, selectedCategory, sortBy]);

  const handleJoinGroup = (groupId, group) => {
    if (group.privacy === 'private') {
      alert(`בקשה להצטרפות לקבוצה "${group.name}" נשלחה למנהלים! 📤`);
    } else {
      alert(`הצטרפת לקבוצה "${group.name}" בהצלחה! 🎉`);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="page-background">
          <div className="floating-element floating-element-1"></div>
          <div className="floating-element floating-element-2"></div>
        </div>
        
        <div className="loading-spinner">
          <div className="spinner-border"></div>
        </div>
        <h3 className="loading-text">מחפש קבוצות מדהימות...</h3>
        <p className="loading-subtitle">רק עוד רגע ונמצא לך את הקהילות הכי מעניינות</p>
      </div>
    );
  }

  return (
    <div className="page-container" dir="rtl">
      
      {/* רקע עם אלמנטים צפים */}
      <div className="page-background">
        <div className="floating-element floating-element-1"></div>
        <div className="floating-element floating-element-2"></div>
        <div className="floating-element floating-element-3"></div>
      </div>

      <div className="container position-relative">
        
        {/* כותרת מפוארת */}
        <div className="page-header">
          <div className="page-icon">
            🌟
          </div>
          <h1 className="page-title">גלה קבוצות מדהימות</h1>
          <p className="page-subtitle">
            מצא את הקהילה המושלמת עבורך מבין אלפי קבוצות פעילות ומעניינות
          </p>
          
          {/* סטטיסטיקות */}
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <div className="stat-label">קבוצות פעילות</div>
            </div>
            <div className="stat-item">
              <span className="stat-number">5,000+</span>
              <div className="stat-label">חברי קהילה</div>
            </div>
            <div className="stat-item">
              <span className="stat-number">1,000+</span>
              <div className="stat-label">פוסטים חדשים</div>
            </div>
          </div>
        </div>

        {/* תיבת חיפוש */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <SearchBox
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חפש קבוצות לפי שם, תיאור או תחום עניין..."
              icon="🔍"
            />
          </div>
        </div>

        {/* כפתורי קטגוריות */}
        <div className="filter-container">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}>
              {category}
            </button>
          ))}
        </div>

        {/* תוצאות */}
        {filteredGroups.length > 0 ? (
          <>
            {/* פאנל מיון ותוצאות */}
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap">
              <p className="loading-text mb-0">
                נמצאו <span className="fw-bold">{filteredGroups.length}</span> קבוצות מדהימות
              </p>
              
              <select 
                className="form-input filter-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}>
                <option value="popular">🔥 הכי פופולרי</option>
                <option value="newest">✨ הכי חדש</option>
                <option value="active">⚡ הכי פעיל</option>
              </select>
            </div>
            
            {/* רשימת קבוצות */}
            <div className="cards-grid">
              {filteredGroups.map((group, index) => (
                <Card 
                  key={group.id} 
                  variant="group" 
                  className="group-card">
                  
                  {/* תווית HOT */}
                  {group.isHot && (
                    <div className="hot-badge">
                      🔥 HOT
                    </div>
                  )}
                  
                  {/* אייקון הקבוצה */}
                  <div className="group-icon-container">
                    <div className="group-icon">
                      {group.icon}
                    </div>
                  </div>
                  
                  <h4 className="group-title">{group.name}</h4>
                  
                  <p className="group-description">
                    {group.description}
                  </p>
                  
                  {/* סטטיסטיקות */}
                  <div className="group-stats">
                    <div className="group-stat">
                      <div className="fw-bold">{group.memberCount.toLocaleString()}</div>
                      <div className="small">חברים</div>
                    </div>
                    <div className="group-stat">
                      <div className="fw-bold">{group.activity}</div>
                      <div className="small">פעילות</div>
                    </div>
                  </div>
                  
                  {/* כפתור הצטרפות */}
                  <div className="d-grid">
                    <Button
                      variant="secondary"
                      onClick={() => handleJoinGroup(group.id, group)}>
                      {group.privacy === 'private' ? (
                        <>
                          <span>🔒</span>
                          בקש להצטרף
                        </>
                      ) : (
                        <>
                          <span>➕</span>
                          הצטרף לקבוצה
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* פוסטים אחרונים */}
                  <div className="group-recent-posts">
                    <div className="recent-posts-title">פוסטים אחרונים:</div>
                    <div>• {group.recentPosts && group.recentPosts.length > 0 ? group.recentPosts[0] : 'אין פוסטים אחרונים'}</div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-container">
              <div className="empty-state-icon">🔍</div>
              <h2 className="empty-state-title">לא נמצאו קבוצות</h2>
              <p className="empty-state-description">
                נסה לחפש במילים אחרות או בחר קטגוריה אחרת
              </p>
              
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('הכל');
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

export default GroupSearchPage;