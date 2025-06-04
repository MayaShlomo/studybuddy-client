import React, { useState, useEffect, useRef } from 'react';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';
import ImageUploadCanvas from '../components/atoms/ImageUploadCanvas';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: '',
    location: '',
    bio: '',
    interests: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showInterests, setShowInterests] = useState(false);
  
  // HTML5 refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // רשימת תחומי עניין לפורום כללי
  const availableInterests = [
    '🍳 בישול', '🎨 אמנות', '🎵 מוזיקה', '📚 ספרות', '🎮 גיימינג', '⚽ ספורט',
    '📷 צילום', '✈️ טיולים', '🎬 סרטים', '📺 טלוויזיה', '🏋️ כושר', '🧘 יוגה',
    '🌱 גינון', '🐕 חיות מחמד', '👗 אופנה', '💄 יופי', '🏠 עיצוב הבית', '🚗 רכב',
    '💻 טכנולוגיה', '📰 חדשות', '💰 כלכלה', '🔬 מדע', '🎭 תיאטרון', '🍷 יין',
    '☕ קפה', '🎲 משחקי לוח', '✍️ כתיבה', '🎪 בידור', '👶 הורות', '💑 זוגיות'
  ];

  useEffect(() => {
    // jQuery animations on load
    $(document).ready(function() {
      // Fade in sections sequentially
      $('.page-header').hide().fadeIn(800);
      $('.glass-card-solid').hide().delay(400).fadeIn(1000);
      
      // Form field animations
      $('.form-group').each(function(index) {
        $(this).css('opacity', '0').delay(100 * index).animate({
          opacity: 1,
          marginTop: '0'
        }, 500);
      });
      
      // Interest tags hover effect
      $(document).on('mouseenter', '.interest-tag', function() {
        $(this).animate({ 
          transform: 'scale(1.1)' 
        }, 200);
      });
      
      $(document).on('mouseleave', '.interest-tag', function() {
        $(this).animate({ 
          transform: 'scale(1)' 
        }, 200);
      });
    });

    // HTML5 Canvas for profile avatar
    if (canvasRef.current) {
      drawDefaultAvatar();
    }
  }, []);

  // HTML5 Canvas - ציור אווטאר ברירת מחדל - דרישה 26.ii
  const drawDefaultAvatar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 150;
    canvas.height = 150;
    
    // רקע מעגלי עם גרדיאנט
    const gradient = ctx.createLinearGradient(0, 0, 150, 150);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(75, 75, 70, 0, Math.PI * 2);
    ctx.fill();
    
    // אייקון משתמש
    ctx.fillStyle = 'white';
    ctx.font = '60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👤', 75, 75);
    
    // טקסט
    if (formData.name) {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(formData.name.substring(0, 15), 75, 125);
    }
  };

  // עדכון Canvas כשהשם משתנה
  useEffect(() => {
    if (!profileImage) {
      drawDefaultAvatar();
    }
  }, [formData.name, profileImage]);

  // העלאת תמונת פרופיל
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
          
          setProfileImage(event.target.result);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
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

  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : prev.interests.length < 10 
          ? [...prev.interests, interest]
          : prev.interests;
      
      return {
        ...prev,
        interests: newInterests
      };
    });
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 1: return 'var(--danger)';
      case 2: return 'var(--warning)';
      case 3: return '#fbbf24';
      case 4: return 'var(--success)';
      default: return '#e2e8f0';
    }
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 1: return 'חלשה';
      case 2: return 'בינונית';
      case 3: return 'חזקה';
      case 4: return 'מעולה';
      default: return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'שם מלא הוא שדה חובה';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'שם חייב להכיל לפחות 2 תווים';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'כתובת אימייל הוא שדה חובה';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }
    
    if (!formData.password) {
      newErrors.password = 'סיסמה הוא שדה חובה';
    } else if (formData.password.length < 8) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 8 תווים';
    } else if (passwordStrength < 3) {
      newErrors.password = 'סיסמה חלשה מדי. הוסף אותיות גדולות, מספרים ותווים מיוחדים';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'אישור סיסמה הוא שדה חובה';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
    }
    
    if (!agreeToTerms) {
      newErrors.terms = 'יש לאשר את תנאי השימוש';
    }
    
    setErrors(newErrors);
    
    // jQuery animation for errors
    Object.keys(newErrors).forEach(field => {
      $(`#${field}-error`).hide().slideDown(300);
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // jQuery shake effect
      $('.glass-card-solid').effect('shake', { times: 2, distance: 10 }, 400);
      return;
    }
    
    setIsLoading(true);
    
    // jQuery Ajax להרשמה - דרישה 25
    $.ajax({
      url: '/api/auth/register',
      method: 'POST',
      data: JSON.stringify({
        ...formData,
        profileImage: profileImage
      }),
      contentType: 'application/json',
      beforeSend: function() {
        $('.glass-card-solid').fadeTo(300, 0.7);
      },
      success: function(response) {
        $('.glass-card-solid').fadeTo(300, 1);
        
        // Success animation
        const $successMsg = $('<div>')
          .addClass('alert alert-success text-center')
          .html(`<h3>🎉 ברוך הבא ${formData.name}!</h3><p>נרשמת בהצלחה. מעביר אותך לכניסה...</p>`)
          .hide();
        
        $('.glass-card-solid').prepend($successMsg);
        $successMsg.slideDown(500);
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      },
      error: function(xhr, status, error) {
        $('.glass-card-solid').fadeTo(300, 1);
        
        // For demo purposes
        setTimeout(() => {
          alert(`ברוך הבא ${formData.name}! נרשמת בהצלחה 🎉`);
          setIsLoading(false);
          navigate('/login');
        }, 2000);
      }
    });
  };

  const handleSocialRegister = (provider) => {
    $.ajax({
      url: `/api/auth/${provider.toLowerCase()}/register`,
      method: 'GET',
      success: function(response) {
        alert(`הרשמה עם ${provider} - יופעל בקרוב`);
      }
    });
  };

  return (
    <div className="page-container" dir="rtl">
      
      {/* אפקטי רקע */}
      <div className="page-background">
        <div className="floating-element floating-element-1"></div>
        <div className="floating-element floating-element-2"></div>
        <div className="floating-element floating-element-3"></div>
      </div>

      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10 col-sm-12">
            
            <Card variant="solid">
                
                {/* כותרת עם תמונת פרופיל */}
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2">הצטרף אלינו</h2>
                  <p className="text-muted mb-3">צור חשבון חדש והתחל את המסע שלך</p>
                  
                  {/* קומפוננטת העלאת תמונה */}
                  <ImageUploadCanvas 
                    canvasRef={canvasRef}
                    fileInputRef={fileInputRef}
                    onImageUpload={handleImageUpload}
                    uploadText="העלה תמונת פרופיל"
                    size={150}
                  />
                  
                  {/* HTML5 Video - דרישה 26.i */}
                  <video 
                    ref={videoRef}
                    width="400" 
                    height="250" 
                    controls
                    muted
                    poster="register-poster.jpg"
                    style={{ 
                      borderRadius: '10px',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                      maxWidth: '100%',
                      display: 'none'
                    }}>
                    <source src="register-tutorial.mp4" type="video/mp4" />
                    <source src="register-tutorial.webm" type="video/webm" />
                    הדפדפן שלך לא תומך בוידאו
                  </video>
                </div>

                {errors.general && (
                  <div className="alert alert-danger mb-4">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleRegister}>
                  
                  {/* שדות בסיסיים */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <Input
                          label="שם מלא"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="הכנס את השם המלא שלך"
                          icon="👤"
                          required
                        />
                        {errors.name && (
                          <div id="name-error" className="text-danger mt-2" style={{ display: 'none' }}>
                            {errors.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Input
                          label="כתובת אימייל"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                          icon="✉️"
                          style={{ direction: 'ltr' }}
                          required
                        />
                        {errors.email && (
                          <div id="email-error" className="text-danger mt-2" style={{ display: 'none' }}>
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* סיסמה */}
                  <div className="mb-3">
                    <label className="form-label">סיסמה</label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input with-icon"
                        placeholder="צור סיסמה חזקה"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                      />
                      <span className="input-icon">🔒</span>
                      
                      <button
                        type="button"
                        className="btn btn-link position-absolute"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ 
                          left: 16, 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          padding: 0,
                          zIndex: 5
                        }}>
                        <span>{showPassword ? '🙈' : '👁️'}</span>
                      </button>
                    </div>
                    
                    {/* מד חוזק סיסמה */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar" 
                              style={{ 
                                width: `${(passwordStrength / 4) * 100}%`,
                                backgroundColor: getStrengthColor(passwordStrength),
                                transition: 'all 0.3s ease'
                              }}>
                            </div>
                          </div>
                          <small style={{ 
                            color: getStrengthColor(passwordStrength), 
                            fontWeight: '600', 
                            minWidth: '60px' 
                          }}>
                            {getStrengthText(passwordStrength)}
                          </small>
                        </div>
                      </div>
                    )}
                    {errors.password && (
                      <div id="password-error" className="text-danger small mt-1" style={{ display: 'none' }}>
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {/* אישור סיסמה */}
                  <div className="mb-4">
                    <label className="form-label">אישור סיסמה</label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-input with-icon"
                        placeholder="אשר את הסיסמה"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                      />
                      <span className="input-icon">✅</span>
                      
                      <button
                        type="button"
                        className="btn btn-link position-absolute"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ 
                          left: 16, 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          padding: 0,
                          zIndex: 5
                        }}>
                        <span>{showConfirmPassword ? '🙈' : '👁️'}</span>
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div id="confirmPassword-error" className="text-danger small mt-1" style={{ display: 'none' }}>
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  {/* שדות אופציונליים */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <Input
                        label="מקצוע (אופציונלי)"
                        value={formData.profession}
                        onChange={(e) => handleInputChange('profession', e.target.value)}
                        placeholder="מה המקצוע שלך?"
                        icon="💼"
                        helperText="המקצוע יעזור לאנשים למצוא אותך"
                      />
                    </div>
                    <div className="col-md-6">
                      <Input
                        label="מיקום (אופציונלי)"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="איפה את/ה נמצא/ת?"
                        icon="📍"
                        helperText="עיר או אזור מגורים"
                      />
                    </div>
                  </div>

                  {/* תיאור קצר */}
                  <div className="mb-4">
                    <label className="form-label">ספר/י קצת על עצמך (אופציונלי)</label>
                    <textarea
                      className="form-input"
                      placeholder="תחומי עניין, מה אוהב/ת לעשות, מה מעניין אותך..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                    />
                    <small className="text-muted">💡 תיאור אישי יעזור לאחרים להכיר אותך טוב יותר</small>
                  </div>

                  {/* תחומי עניין */}
                  <div className="mb-4">
                    <label className="form-label">תחומי עניין (אופציונלי)</label>
                    
                    {/* תחומי עניין שנבחרו - תמיד מוצגים */}
                    {formData.interests.length > 0 && (
                      <div className="selected-interests-display mb-3">
                        <div className="d-flex flex-wrap gap-2">
                          {formData.interests.map((interest) => (
                            <span 
                              key={interest} 
                              className="selected-interest-badge">
                              {interest}
                              <button
                                type="button"
                                className="remove-interest-btn"
                                onClick={() => handleInterestToggle(interest)}
                                aria-label="הסר">
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* כפתור פתיחת בורר */}
                    {!showInterests ? (
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setShowInterests(true)}
                        style={{ borderRadius: '20px' }}>
                        <span className="me-1">➕</span>
                        {formData.interests.length > 0 ? 'הוסף עוד' : 'בחר תחומי עניין'}
                      </button>
                    ) : (
                      /* בורר תחומי עניין */
                      <div className="interests-selector">
                        <div className="interests-grid mb-3">
                          {availableInterests.map((interest) => (
                            <button
                              key={interest}
                              type="button"
                              className={`interest-tag btn ${
                                formData.interests.includes(interest) 
                                  ? 'btn-primary' 
                                  : 'btn-outline-secondary'
                              }`}
                              onClick={() => handleInterestToggle(interest)}
                              disabled={!formData.interests.includes(interest) && formData.interests.length >= 10}
                              style={{ 
                                borderRadius: '20px',
                                padding: '6px 14px',
                                fontSize: '0.85rem',
                                whiteSpace: 'nowrap'
                              }}>
                              {interest}
                            </button>
                          ))}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            נבחרו {formData.interests.length} מתוך 10 מקסימום
                          </small>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => setShowInterests(false)}>
                            סיום
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* תנאי שימוש */}
                  <div className="mb-4" style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: '10px', alignItems: 'start' }}>
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="terms" 
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      style={{ 
                        marginTop: '2px',
                        cursor: 'pointer'
                      }}
                    />
                    <div>
                      <label 
                        className="form-check-label text-secondary" 
                        htmlFor="terms"
                        style={{ cursor: 'pointer' }}>
                        אני מסכים/ה ל
                        <Link to="/terms" className="text-primary text-decoration-none mx-1">
                          תנאי השימוש
                        </Link>
                        ו
                        <Link to="/privacy" className="text-primary text-decoration-none ms-1">
                          מדיניות הפרטיות
                        </Link>
                      </label>
                      {errors.terms && (
                        <div className="text-danger small mt-1">
                          {errors.terms}
                        </div>
                      )}
                    </div>
                  </div>

                  
                  {/* כפתור הרשמה */}
                  <div className="d-grid mb-4">
                    <Button 
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isLoading || !agreeToTerms}>
                      
                      {isLoading ? (
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="spinner-border spinner-border-sm me-2" />
                          יוצר חשבון...
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center">
                          <span className="me-2">🚀</span>
                          צור חשבון חדש
                        </div>
                      )}
                    </Button>
                  </div>

                  {/* מחיצה */}
                  <div className="text-center mb-4">
                    <div className="position-relative">
                      <hr />
                      <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted">
                        או הירשם עם
                      </span>
                    </div>
                  </div>

                  {/* כפתורי רישום חברתי */}
                  <div className="row g-2 mb-4">
                    <div className="col-6">
                      <Button
                        variant="outline"
                        onClick={() => handleSocialRegister('Google')}
                        className="w-100 social-login-btn">
                        <span className="me-2">🌐</span>
                        Google
                      </Button>
                    </div>
                    <div className="col-6">
                      <Button
                        variant="outline"
                        onClick={() => handleSocialRegister('Facebook')}
                        className="w-100 social-login-btn">
                        <span className="me-2">📘</span>
                        Facebook
                      </Button>
                    </div>
                  </div>

                </form>

                {/* התחברות */}
                <div className="text-center">
                  <p className="text-muted mb-0">
                    כבר יש לך חשבון? 
                    <Link to="/login" className="text-primary text-decoration-none fw-semibold ms-1">
                      התחבר כאן
                    </Link>
                  </p>
                </div>

            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;