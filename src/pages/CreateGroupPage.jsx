import React, { useState } from 'react';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';

function CreateGroupPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    privacy: 'public',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'technology', label: '💻 טכנולוגיה' },
    { value: 'art', label: '🎨 אמנות ויצירה' },
    { value: 'sports', label: '🏃‍♂️ ספורט ופעילות גופנית' },
    { value: 'education', label: '📚 לימודים וחינוך' },
    { value: 'music', label: '🎵 מוסיקה' },
    { value: 'cooking', label: '🍳 בישול וקולינריה' },
    { value: 'travel', label: '✈️ נסיעות וטיולים' },
    { value: 'books', label: '📖 ספרים וקריאה' },
    { value: 'gaming', label: '🎮 משחקים' },
    { value: 'health', label: '🏥 בריאות ורפואה' },
    { value: 'business', label: '💼 עסקים ויזמות' },
    { value: 'photography', label: '📸 צילום' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'שם הקבוצה הוא שדה חובה';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'שם הקבוצה חייב להכיל לפחות 3 תווים';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'תיאור הקבוצה הוא שדה חובה';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'תיאור הקבוצה חייב להכיל לפחות 10 תווים';
    }
    
    if (!formData.category) {
      newErrors.category = 'יש לבחור תחום התעניינות';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      setTimeout(() => {
        alert(`קבוצת "${formData.name}" נוצרה בהצלחה! 🎉`);
        
        setFormData({
          name: '',
          description: '',
          privacy: 'public',
          category: ''
        });
        
        setIsSubmitting(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error creating group:', error);
      alert('שגיאה ביצירת הקבוצה. נסה שוב.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container" dir="rtl">
      
      {/* רקע עם אלמנטים צפים */}
      <div className="page-background">
        <div className="floating-element floating-element-1"></div>
        <div className="floating-element floating-element-2"></div>
        <div className="floating-element floating-element-3"></div>
      </div>

      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            
            {/* כותרת העמוד */}
            <div className="page-header">
              <div className="page-icon">
                👥
              </div>
              <h1 className="page-title">יצירת קבוצה חדשה</h1>
              <p className="page-subtitle">
                צור את הקבוצה המושלמת עבורך ועבור החברים שלך
              </p>
            </div>

            {/* טופס יצירת קבוצה */}
            <Card variant="solid">
              
              <form onSubmit={handleSubmit} className="create-group-form">
                
                {/* שם הקבוצה */}
                <Input
                  label="שם הקבוצה"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="הכנס שם מעניין לקבוצה..."
                  icon="📝"
                  helperText={errors.name || "שם הקבוצה יוצג לכל המשתמשים"}
                  className={errors.name ? 'error' : ''}
                  required
                />
                
                {/* תיאור הקבוצה */}
                <div className="form-group">
                  <label className="form-label">תיאור הקבוצה</label>
                  <textarea
                    className={`form-input ${errors.description ? 'error' : ''}`}
                    placeholder="תאר את מטרת הקבוצה והפעילויות שתתרחשו בה..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    required
                  />
                  {errors.description && (
                    <div className="text-danger mt-2">
                      {errors.description}
                    </div>
                  )}
                  <small className="text-muted d-block mt-2">
                    💡 תיאור טוב יעזור לאנשים למצוא את הקבוצה
                  </small>
                </div>

                {/* רמת פרטיות */}
                <div className="form-group">
                  <label className="form-label">רמת פרטיות</label>
                  <select
                    className="form-input form-select"
                    value={formData.privacy}
                    onChange={(e) => handleInputChange('privacy', e.target.value)}>
                    <option value="public">🌍 ציבורית - כולם יכולים לראות ולהצטרף</option>
                    <option value="private">🔒 פרטית - רק לפי הזמנה או אישור</option>
                  </select>
                  <small className="text-muted d-block mt-2">
                    {formData.privacy === 'public' ? 
                      '🌍 כולם יכולים לראות ולהצטרף לקבוצה' : 
                      '🔒 חברים חדשים מצטרפים רק לאחר אישור'
                    }
                  </small>
                </div>
                
                {/* תחום עניין */}
                <div className="form-group">
                  <label className="form-label">תחום התעניינות</label>
                  <select
                    className={`form-input form-select ${errors.category ? 'error' : ''}`}
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}>
                    <option value="">בחר תחום עניין...</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="text-danger mt-2">
                      {errors.category}
                    </div>
                  )}
                </div>

                {/* כפתור יצירה */}
                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}>
                    
                    {isSubmitting ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" />
                        יוצר קבוצה...
                      </>
                    ) : (
                      <>
                        <span>➕</span>
                        צור קבוצה חדשה
                      </>
                    )}
                  </Button>
                </div>
              </form>
              
              {/* טיפ */}
              <div className="text-center mt-4">
                <small className="text-muted">
                  💡 טיפ: קבוצות עם תיאור ברור ותחום עניין מעניין מקבלות יותר חברים
                </small>
              </div>
              
            </Card>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupPage;