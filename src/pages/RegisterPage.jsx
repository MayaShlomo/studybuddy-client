import React, { useState } from 'react';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';
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
    bio: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      setTimeout(() => {
        alert(`ברוך הבא ${formData.name}! נרשמת בהצלחה 🎉`);
        setIsLoading(false);
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'שגיאה בהרשמה. נסה שוב.' });
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    alert(`הרשמה עם ${provider} - לממש בהמשך`);
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
          <div className="col-lg-6 col-md-8 col-sm-10">
            
            <Card variant="solid">
                
                {/* כותרת */}
                <div className="text-center mb-4">
                  <div className="page-icon mb-3">
                    <span>👥</span>
                  </div>
                  <h2 className="fw-bold mb-2">הצטרף אלינו</h2>
                  <p className="text-muted">צור חשבון חדש והתחל את המסע שלך</p>
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
                      <Input
                        label="שם מלא"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="הכנס את השם המלא שלך"
                        icon="👤"
                        helperText={errors.name}
                        className={errors.name ? 'error' : ''}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <Input
                        label="כתובת אימייל"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        icon="✉️"
                        helperText={errors.email}
                        className={errors.email ? 'error' : ''}
                        style={{ direction: 'ltr' }}
                        required
                      />
                    </div>
                  </div>

                  {/* סיסמה */}
                  <div className="mb-3">
                    <label className="form-label">סיסמה</label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-input with-icon ${errors.password ? 'error' : ''}`}
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
                      <div className="text-danger small mt-1">{errors.password}</div>
                    )}
                  </div>

                  {/* אישור סיסמה */}
                  <div className="mb-4">
                    <label className="form-label">אישור סיסמה</label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-input with-icon ${errors.confirmPassword ? 'error' : ''}`}
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
                      <div className="text-danger small mt-1">{errors.confirmPassword}</div>
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

                  {/* תנאי שימוש */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="terms" 
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                      />
                      <label className="form-check-label text-secondary" htmlFor="terms">
                        אני מסכים/ה ל
                        <Link to="/terms" className="text-primary text-decoration-none ms-1">
                          תנאי השימוש
                        </Link>
                        ו
                        <Link to="/privacy" className="text-primary text-decoration-none ms-1">
                          מדיניות הפרטיות
                        </Link>
                      </label>
                    </div>
                    {errors.terms && (
                      <div className="text-danger small mt-1">{errors.terms}</div>
                    )}
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
                        className="w-100">
                        <span className="me-2">🌐</span>
                        Google
                      </Button>
                    </div>
                    <div className="col-6">
                      <Button
                        variant="outline"
                        onClick={() => handleSocialRegister('Facebook')}
                        className="w-100">
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