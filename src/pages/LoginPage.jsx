import React, { useState } from 'react';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'כתובת אימייל הוא שדה חובה';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }
    
    if (!formData.password) {
      newErrors.password = 'סיסמה הוא שדה חובה';
    } else if (formData.password.length < 6) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 6 תווים';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      setTimeout(() => {
        const userData = {
          id: 1,
          name: 'משתמש לדוגמה',
          email: formData.email
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (rememberMe) {
          localStorage.setItem('rememberUser', formData.email);
        }
        
        setIsLoading(false);
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'שגיאה בהתחברות. בדוק את הפרטים ונסה שוב.' });
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`התחברות עם ${provider} - לממש בהמשך`);
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
          <div className="col-lg-5 col-md-8">
            
            <div className="animate-fadeInUp">
              <Card variant="solid">
                
                {/* כותרת */}
                <div className="text-center mb-5">
                  <div className="page-icon">
                    👤
                  </div>
                  <h2 className="h1 fw-bold text-primary mb-3">
                    ברוך השב!
                  </h2>
                  <p className="text-secondary mb-0">
                    התחבר כדי להמשיך לחשבון שלך
                  </p>
                </div>

                {/* הודעת שגיאה כללית */}
                {errors.general && (
                  <div className="alert alert-danger mb-4">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  
                  {/* שדה אימייל */}
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

                  {/* שדה סיסמה */}
                  <div className="form-group">
                    <label className="form-label">סיסמה</label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-input with-icon ${errors.password ? 'error' : ''}`}
                        placeholder="הכנס את הסיסמה שלך"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                      />
                      <span className="input-icon">🔒</span>
                      
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="btn btn-link position-absolute"
                        style={{
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          padding: 0,
                          zIndex: 10
                        }}>
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="text-danger mt-2">
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {/* זכור אותי ושכחת סיסמה */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Link 
                      to="/reset-password" 
                      className="text-primary text-decoration-none fw-medium">
                      שכחת סיסמה?
                    </Link>
                    
                    <div className="d-flex align-items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="form-check-input"
                      />
                      <label htmlFor="rememberMe" className="text-secondary">
                        זכור אותי
                      </label>
                    </div>
                  </div>

                  {/* כפתור התחברות */}
                  <div className="d-grid mb-4">
                    <Button 
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isLoading || !formData.email || !formData.password}>
                      
                      {isLoading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" />
                          מתחבר...
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          התחבר לחשבון
                        </>
                      )}
                    </Button>
                  </div>

                  {/* מחיצה */}
                  <div className="text-center mb-4">
                    <div className="position-relative">
                      <hr />
                      <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted">
                        או
                      </span>
                    </div>
                  </div>

                  {/* כפתורי רשתות חברתיות */}
                  <div className="row gap-2 mb-4">
                    <div className="col">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin('Google')}
                        className="w-100">
                        <span>🌐</span>
                        Google
                      </Button>
                    </div>
                    <div className="col">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin('Facebook')}
                        className="w-100">
                        <span>📘</span>
                        Facebook
                      </Button>
                    </div>
                  </div>

                </form>

                {/* לינק להרשמה */}
                <div className="text-center">
                  <p className="text-muted mb-0">
                    עדיין אין לך חשבון? 
                    <Link 
                      to="/register" 
                      className="text-primary text-decoration-none fw-semibold ms-1">
                      הירשם עכשיו
                    </Link>
                  </p>
                </div>

              </Card>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;