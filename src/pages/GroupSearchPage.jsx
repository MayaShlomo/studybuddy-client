import React, { useState, useEffect, useRef } from 'react';
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
  
  // חיפוש מתקדם - דרישה 20
  const [advancedSearch, setAdvancedSearch] = useState({
    memberCountMin: '',
    memberCountMax: '',
    privacy: 'all',
    activityLevel: 'all',
    createdAfter: ''
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  // HTML5 Canvas ref
  const canvasRef = useRef(null);

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
  ];

  // טעינת קבוצות עם jQuery Ajax - דרישה 25
  useEffect(() => {
    loadGroupsWithJQuery();
    
    // HTML5 Canvas animation
    if (canvasRef.current) {
      drawCanvasAnimation();
    }
  }, []);

  const loadGroupsWithJQuery = () => {
    $.ajax({
      url: '/api/groups',
      method: 'GET',
      success: function(data) {
        setTimeout(() => {
          setGroups(dummyGroups);
          setFilteredGroups(dummyGroups);
          setIsLoading(false);
        }, 1200);
      },
      error: function(xhr, status, error) {
        console.error('Error loading groups:', error);
        setGroups(dummyGroups);
        setFilteredGroups(dummyGroups);
        setIsLoading(false);
      }
    });
  };

  // HTML5 Canvas Animation - דרישה 26.ii
  const drawCanvasAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    let rotation = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.save();
      ctx.translate(100, 100);
      ctx.rotate(rotation);
      
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(50 * Math.cos(i * Math.PI / 3), 50 * Math.sin(i * Math.PI / 3), 10, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${i * 60}, 70%, 50%)`;
        ctx.fill();
      }
      
      ctx.restore();
      
      rotation += 0.02;
      requestAnimationFrame(animate);
    };
    
    animate();
  };

  // סינון מתקדם - דרישה 20
  useEffect(() => {
    let filtered = groups;

    if (selectedCategory !== 'הכל') {
      const categoryName = selectedCategory.split(' ')[1];
      filtered = filtered.filter(group => 
        group.category === categoryName || 
        group.category === selectedCategory
      );
    }

    if (query.trim()) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(query.toLowerCase()) ||
        group.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (showAdvancedSearch) {
      if (advancedSearch.memberCountMin) {
        filtered = filtered.filter(group => 
          group.memberCount >= parseInt(advancedSearch.memberCountMin)
        );
      }
      
      if (advancedSearch.memberCountMax) {
        filtered = filtered.filter(group => 
          group.memberCount <= parseInt(advancedSearch.memberCountMax)
        );
      }
      
      if (advancedSearch.privacy !== 'all') {
        filtered = filtered.filter(group => 
          group.privacy === advancedSearch.privacy
        );
      }
      
      if (advancedSearch.activityLevel !== 'all') {
        filtered = filtered.filter(group => 
          group.activity === advancedSearch.activityLevel
        );
      }
      
      if (advancedSearch.createdAfter) {
        filtered = filtered.filter(group => 
          new Date(group.createdAt) >= new Date(advancedSearch.createdAfter)
        );
      }
    }

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
  }, [groups, query, selectedCategory, sortBy, advancedSearch, showAdvancedSearch]);

  // רק פעולת הצטרפות - הסרנו Update ו-Delete
  const handleJoinGroup = (groupId, group) => {
    $.ajax({
      url: `/api/groups/${groupId}/join`,
      method: 'POST',
      data: JSON.stringify({ userId: 'current-user-id' }),
      success: function(response) {
        if (group.privacy === 'private') {
          alert(`בקשה להצטרפות לקבוצה "${group.name}" נשלחה למנהלים! 📤`);
        } else {
          alert(`הצטרפת לקבוצה "${group.name}" בהצלחה! 🎉`);
        }
      },
      error: function(xhr) {
        alert('שגיאה בהצטרפות לקבוצה');
      }
    });
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
      
      <div className="page-background">
        <div className="floating-element floating-element-1"></div>
        <div className="floating-element floating-element-2"></div>
        <div className="floating-element floating-element-3"></div>
      </div>

      <div className="container position-relative">
        
        <div className="page-header">
          <div className="page-icon">
            <span>👥</span>
          </div>
          <h1 className="page-title">
            מצא קבוצות חדשות
          </h1>
          <p className="page-subtitle">
            מצא את הקהילה המושלמת עבורך מבין אלפי קבוצות פעילות ומעניינות
          </p>
          
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

        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <SearchBox
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חפש קבוצות לפי שם, תיאור או תחום עניין..."
              icon="🔍"
            />
            
            <div className="text-center mt-3">
              <Button
                variant="outline"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
                <span>⚙️</span>
                חיפוש מתקדם
              </Button>
            </div>
          </div>
        </div>

        {showAdvancedSearch && (
          <div className="row justify-content-center mb-4">
            <div className="col-lg-10">
              <Card variant="glass" className="p-4">
                <h4 className="text-white mb-3">חיפוש מתקדם - 5 פרמטרים</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="text-white mb-1">מספר חברים מינימלי</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="לדוגמה: 100"
                      value={advancedSearch.memberCountMin}
                      onChange={(e) => setAdvancedSearch({
                        ...advancedSearch,
                        memberCountMin: e.target.value
                      })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="text-white mb-1">מספר חברים מקסימלי</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="לדוגמה: 1000"
                      value={advancedSearch.memberCountMax}
                      onChange={(e) => setAdvancedSearch({
                        ...advancedSearch,
                        memberCountMax: e.target.value
                      })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="text-white mb-1">סוג קבוצה</label>
                    <select 
                      className="form-input"
                      value={advancedSearch.privacy}
                      onChange={(e) => setAdvancedSearch({
                        ...advancedSearch,
                        privacy: e.target.value
                      })}>
                      <option value="all">הכל</option>
                      <option value="public">ציבורית</option>
                      <option value="private">פרטית</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="text-white mb-1">רמת פעילות</label>
                    <select 
                      className="form-input"
                      value={advancedSearch.activityLevel}
                      onChange={(e) => setAdvancedSearch({
                        ...advancedSearch,
                        activityLevel: e.target.value
                      })}>
                      <option value="all">הכל</option>
                      <option value="גבוהה">גבוהה</option>
                      <option value="בינונית">בינונית</option>
                      <option value="נמוכה">נמוכה</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="text-white mb-1">נוצרה אחרי</label>
                    <input
                      type="date"
                      className="form-input"
                      value={advancedSearch.createdAfter}
                      onChange={(e) => setAdvancedSearch({
                        ...advancedSearch,
                        createdAfter: e.target.value
                      })}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

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

        {filteredGroups.length > 0 ? (
          <>
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
            
            <div className="groups-columns-container">
              {filteredGroups.map((group, index) => (
                <Card 
                  key={group.id} 
                  variant="group" 
                  className="group-card mb-3">
                  
                  {group.isHot && (
                    <div className="hot-badge">
                      🔥 HOT
                    </div>
                  )}
                  
                  <div className="group-icon-container">
                    <div className="group-icon">
                      {group.icon}
                    </div>
                  </div>
                  
                  <h4 className="group-title">{group.name}</h4>
                  
                  <p className="group-description">
                    {group.description}
                  </p>
                  
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
                  
                  {/* רק כפתור הצטרפות - הסרנו עריכה ומחיקה */}
                  <div className="d-flex gap-2 mb-2">
                    <Button
                      variant="secondary"
                      className="flex-grow-1"
                      onClick={() => handleJoinGroup(group.id, group)}>
                      {group.privacy === 'private' ? (
                        <>
                          <span>🔒</span>
                          בקש להצטרף
                        </>
                      ) : (
                        <>
                          <span>➕</span>
                          הצטרף
                        </>
                      )}
                    </Button>
                  </div>
                  
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
                  setAdvancedSearch({
                    memberCountMin: '',
                    memberCountMax: '',
                    privacy: 'all',
                    activityLevel: 'all',
                    createdAfter: ''
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

export default GroupSearchPage;