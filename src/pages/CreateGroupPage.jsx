import React, { useState, useRef, useEffect } from 'react';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';
import ImageUploadCanvas from '../components/atoms/ImageUploadCanvas';
import GroupRolesManager from '../components/molecules/GroupRolesManager';

function CreateGroupPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    privacy: 'public',
    category: '',
    rules: '',
    maxMembers: '',
    approvalRequired: false,
    allowComments: true,
    allowPosts: true,
    setupRolesLater: true,
    assignedRoles: []  // הוספת שדה חדש
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [groupImage, setGroupImage] = useState(null);
  
  // HTML5 refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    // jQuery animations on load
    $(document).ready(function() {
      $('.page-header').hide().fadeIn(1000);
      $('.create-group-form').hide().slideDown(800);
      
      // jQuery hover effects
      $('.form-input, .form-select, textarea').hover(
        function() {
          $(this).addClass('input-hover');
        },
        function() {
          $(this).removeClass('input-hover');
        }
      );
    });

    // Draw initial canvas
    if (canvasRef.current) {
      drawGroupIcon();
    }
  }, []);

  // HTML5 Canvas - ציור אייקון קבוצה - דרישה 26.ii
  const drawGroupIcon = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 150;
    canvas.height = 150;
    
    // רקע מעגלי
    ctx.fillStyle = '#667eea';
    ctx.beginPath();
    ctx.arc(75, 75, 70, 0, Math.PI * 2);
    ctx.fill();
    
    // אייקון קבוצה
    ctx.fillStyle = 'white';
    ctx.font = '60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👥', 75, 75);
    
    // טקסט
    if (formData.name) {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(formData.name.substring(0, 10), 75, 120);
    }
  };

  // עדכון Canvas כשהשם משתנה
  useEffect(() => {
    drawGroupIcon();
  }, [formData.name]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // jQuery לנקות שגיאות
    if (errors[field]) {
      $(`#${field}-error`).fadeOut(300, function() {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      });
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
    
    if (!formData.rules.trim()) {
      newErrors.rules = 'יש להגדיר חוקי קבוצה';
    }
    
    setErrors(newErrors);
    
    // jQuery להראות שגיאות עם אנימציה
    Object.keys(newErrors).forEach(field => {
      $(`#${field}-error`).hide().fadeIn(500);
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // jQuery לגלול לשגיאה הראשונה
      const firstError = Object.keys(errors)[0];
      $('html, body').animate({
        scrollTop: $(`[name="${firstError}"]`).offset().top - 100
      }, 500);
      return;
    }
    
    setIsSubmitting(true);
    
    // jQuery Ajax לשליחת הטופס - דרישה 25
    $.ajax({
      url: '/api/groups',
      method: 'POST',
      data: JSON.stringify(formData),
      contentType: 'application/json',
      beforeSend: function() {
        $('.create-group-form').fadeTo(500, 0.5);
      },
      success: function(response) {
        // אנימציית הצלחה
        $('.create-group-form').fadeTo(500, 1);
        
        // הודעת הצלחה עם jQuery
        const successMessage = $('<div>')
          .addClass('alert alert-success')
          .html(`<h3>🎉 קבוצת "${formData.name}" נוצרה בהצלחה!</h3>`)
          .hide();
          
        $('.page-header').after(successMessage);
        successMessage.slideDown(500);
        
        // איפוס הטופס
        setTimeout(() => {
          setFormData({
            name: '',
            description: '',
            privacy: 'public',
            category: '',
            rules: '',
            maxMembers: '',
            approvalRequired: false,
            allowComments: true,
            allowPosts: true,
            setupRolesLater: true,
            assignedRoles: []
          });
          setGroupImage(null);
          successMessage.slideUp(500, function() {
            $(this).remove();
          });
        }, 3000);
        
        setIsSubmitting(false);
      },
      error: function(xhr, status, error) {
        $('.create-group-form').fadeTo(500, 1);
        alert('שגיאה ביצירת הקבוצה. נסה שוב.');
        setIsSubmitting(false);
      }
    });
  };

  // העלאת תמונה ל-Canvas
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          canvas.width = 150;
          canvas.height = 150;
          
          // חיתוך מעגלי
          ctx.beginPath();
          ctx.arc(75, 75, 70, 0, Math.PI * 2);
          ctx.clip();
          
          // ציור התמונה
          ctx.drawImage(img, 0, 0, 150, 150);
          
          setGroupImage(event.target.result);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
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
          <div className="col-lg-8 col-md-10">
            
            {/* כותרת העמוד */}
            <div className="page-header">
              <h1 className="page-title">יצירת קבוצה חדשה</h1>
              <p className="page-subtitle mb-4">
                צור את הקבוצה המושלמת עבורך ועבור החברים שלך
              </p>
              
              {/* קומפוננטת העלאת תמונה */}
              <ImageUploadCanvas 
                canvasRef={canvasRef}
                fileInputRef={fileInputRef}
                onImageUpload={handleImageUpload}
                uploadText="העלה תמונת קבוצה"
                size={150}
              />
              
              {/* HTML5 Video הדרכה - דרישה 26.i */}
              <div className="text-center mt-4">
                <video 
                  ref={videoRef}
                  width="500" 
                  height="300" 
                  controls
                  poster="create-group-poster.jpg"
                  style={{ 
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    maxWidth: '100%'
                  }}>
                  <source src="create-group-tutorial.mp4" type="video/mp4" />
                  <source src="create-group-tutorial.webm" type="video/webm" />
                  <track 
                    kind="subtitles" 
                    src="subtitles-he.vtt" 
                    srclang="he" 
                    label="עברית" 
                    default 
                  />
                  הדפדפן שלך לא תומך בוידאו
                </video>
                <p className="text-white mt-2">
                  <small>צפה בסרטון הדרכה ליצירת קבוצה</small>
                </p>
              </div>
            </div>

            {/* טופס יצירת קבוצה מורחב */}
            <Card variant="solid">
              
              <form onSubmit={handleSubmit} className="create-group-form">
                
                {/* שם הקבוצה */}
                <Input
                  name="name"
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
                <div id="name-error" className="text-danger" style={{ display: 'none' }}></div>
                
                {/* תיאור הקבוצה */}
                <div className="form-group">
                  <label className="form-label">תיאור הקבוצה</label>
                  <textarea
                    name="description"
                    className={`form-input ${errors.description ? 'error' : ''}`}
                    placeholder="תאר את מטרת הקבוצה והפעילויות שתתרחשו בה..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    required
                  />
                  {errors.description && (
                    <div id="description-error" className="text-danger mt-2">
                      {errors.description}
                    </div>
                  )}
                  <small className="text-muted d-block mt-2">
                    💡 תיאור טוב יעזור לאנשים למצוא את הקבוצה
                  </small>
                </div>

                {/* חוקי הקבוצה - שדה נוסף */}
                <div className="form-group">
                  <label className="form-label">חוקי הקבוצה</label>
                  <textarea
                    name="rules"
                    className={`form-input ${errors.rules ? 'error' : ''}`}
                    placeholder="הגדר חוקים וכללי התנהגות לחברי הקבוצה..."
                    value={formData.rules}
                    onChange={(e) => handleInputChange('rules', e.target.value)}
                    rows={3}
                    required
                  />
                  {errors.rules && (
                    <div id="rules-error" className="text-danger mt-2">
                      {errors.rules}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    {/* רמת פרטיות */}
                    <div className="form-group">
                      <label className="form-label">רמת פרטיות</label>
                      <select
                        className="form-input form-select"
                        value={formData.privacy}
                        onChange={(e) => handleInputChange('privacy', e.target.value)}>
                        <option value="public">🌍 ציבורית - כולם יכולים לראות ולהצטרף</option>
                        <option value="private">🔒 פרטית - רק לפי הזמנה או אישור</option>
                        <option value="secret">🤫 סודית - לא מופיעה בחיפושים</option>
                      </select>
                      <small className="text-muted d-block mt-2">
                        {formData.privacy === 'public' ? 
                          '🌍 כולם יכולים לראות ולהצטרף לקבוצה' : 
                          formData.privacy === 'private' ?
                          '🔒 חברים חדשים מצטרפים רק לאחר אישור' :
                          '🤫 הקבוצה לא תופיע בחיפושים'
                        }
                      </small>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    {/* תחום עניין */}
                    <div className="form-group">
                      <label className="form-label">תחום התעניינות</label>
                      <select
                        name="category"
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
                        <div id="category-error" className="text-danger mt-2">
                          {errors.category}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* הגדרות הרשאות - מתוקן */}
                <div className="form-group mt-4">
                  <label className="form-label">הגדרות הרשאות</label>
                  
                  {/* תיבות סימון בפריסת Grid כדי למנוע דריסה */}
                  <div className="mb-4">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: '10px', alignItems: 'start' }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="approvalRequired"
                            checked={formData.approvalRequired}
                            onChange={(e) => handleInputChange('approvalRequired', e.target.checked)}
                            style={{ marginTop: '2px' }}
                          />
                          <label className="form-check-label" htmlFor="approvalRequired" style={{ cursor: 'pointer' }}>
                            דרוש אישור להצטרפות
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: '10px', alignItems: 'start' }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="allowComments"
                            checked={formData.allowComments}
                            onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                            style={{ marginTop: '2px' }}
                          />
                          <label className="form-check-label" htmlFor="allowComments" style={{ cursor: 'pointer' }}>
                            אפשר תגובות
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: '10px', alignItems: 'start' }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="allowPosts"
                            checked={formData.allowPosts}
                            onChange={(e) => handleInputChange('allowPosts', e.target.checked)}
                            style={{ marginTop: '2px' }}
                          />
                          <label className="form-check-label" htmlFor="allowPosts" style={{ cursor: 'pointer' }}>
                            אפשר פרסום פוסטים
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* קומפוננטת ניהול תפקידים */}
                  <GroupRolesManager 
                    onRolesUpdate={(roles) => handleInputChange('assignedRoles', roles)}
                  />

                  {/* הודעה על הרשאות ברירת מחדל */}
                  <div className="bg-light rounded p-3">
                    <h6 className="mb-2">הרשאות ברירת מחדל לחברי קבוצה:</h6>
                    <ul className="mb-0 small">
                      <li>פרסום פוסטים: {formData.allowPosts ? '✅ מאושר' : '❌ חסום'}</li>
                      <li>כתיבת תגובות: {formData.allowComments ? '✅ מאושר' : '❌ חסום'}</li>
                      <li>הצטרפות לקבוצה: {formData.approvalRequired ? '🔒 דורש אישור מנהל' : '🌍 פתוח לכולם'}</li>
                    </ul>
                  </div>
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