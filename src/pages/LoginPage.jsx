import React, { useState, useEffect, useRef } from 'react';
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
  
  // HTML5 Canvas ref
  const canvasRef = useRef(null);

  useEffect(() => {
    // jQuery animations on load
    $(document).ready(function() {
      // Fade in animation
      $('.glass-card-solid').hide().fadeIn(1000);
      
      // Input focus effects with jQuery
      $('.form-input').focus(function() {
        $(this).parent().addClass('input-focused');
      }).blur(function() {
        $(this).parent().removeClass('input-focused');
      });
      
      // Button hover effect
      $('.btn').hover(
        function() {
          $(this).stop().animate({ 
            'padding-top': '0.85rem',
            'padding-bottom': '0.85rem' 
          }, 200);
        },
        function() {
          $(this).stop().animate({ 
            'padding-top': '0.75rem',
            'padding-bottom': '0.75rem' 
          }, 200);
        }
      );
    });

    // HTML5 Canvas animation
    if (canvasRef.current) {
      drawLoginAnimation();
    }

    // Check for saved email
    const savedEmail = localStorage.getItem('rememberUser');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // HTML5 Canvas Animation - דרישה 26.ii
  const drawLoginAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 100;
    
    let particles = [];
    
    // יצירת חלקיקים
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        color: `hsl(${Math.random() * 60 + 200}, 70%, 50%)`
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // jQuery לנקות שגיאות עם אנימציה
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
    
    // jQuery להראות שגיאות עם אנימציה
    Object.keys(newErrors).forEach(field => {
      $(`#${field}-error`).hide().slideDown(300);
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // jQuery shake animation for form
      $('.glass-card-solid').effect('shake', { times: 2, distance: 10 }, 400);
      return;
    }
    
    setIsLoading(true);
    
    // jQuery Ajax לכניסה - דרישה 25
    $.ajax({
      url: '/api/auth/login',
      method: 'POST',
      data: JSON.stringify(formData),
      contentType: 'application/json',
      beforeSend: function() {
        $('.glass-card-solid').fadeTo(300, 0.7);
      },
      success: function(response) {
        // Animation success
        $('.glass-card-solid').fadeTo(300, 1);
        
        // Save user data
        const userData = {
          id: response.id || 1,
          name: response.name || 'משתמש לדוגמה',
          email: formData.email,
          token: response.token || 'dummy-token'
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        
        if (rememberMe) {
          localStorage.setItem('rememberUser', formData.email);
        } else {
          localStorage.removeItem('rememberUser');
        }
        
        // Success animation
        const $successMsg = $('<div>')
          .addClass('alert alert-success')
          .text('התחברת בהצלחה! מעביר אותך...')
          .hide();
        
        $('.glass-card-solid').prepend($successMsg);
        $successMsg.slideDown(500);
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      },
      error: function(xhr, status, error) {
        $('.glass-card-solid').fadeTo(300, 1);
        
        // For demo purposes, login anyway
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
      }
    });
  };

  const handleSocialLogin = (provider) => {
    // jQuery Ajax for social login
    $.ajax({
      url: `/api/auth/${provider.toLowerCase()}`,
      method: 'GET',
      success: function(response) {
        alert(`התחברות עם ${provider} - יופעל בקרוב`);
      }
    });
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
                
                {/* Canvas Animation */}
                <div className="text-center mb-4">
                  <canvas 
                    ref={canvasRef}
                    style={{ 
                      borderRadius: '10px',
                      background: 'rgba(102, 126, 234, 0.1)'
                    }}
                  />
                </div>
                
                {/* כותרת */}
                <div className="text-center mb-5">
                  <div className="page-icon">
                    👤
                  </div>
                  <h2 className="h1 fw-bold text-primary mb-3">
                   טוב לראותך שוב
                  </h2>
                  <p className="text-secondary mb-0">
                    התחבר כדי להמשיך לחשבון שלך
                  </p>
                </div>

                {/* הודעת שגיאה כללית */}
                {errors.general && (
                  <div className="alert alert-danger mb-4" id="general-error">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  
                  {/* שדה אימייל */}
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

                  {/* שדה סיסמה */}
                  <div className="form-group">
                    <label className="form-label">סיסמה</label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input with-icon"
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
                      <div id="password-error" className="text-danger mt-2" style={{ display: 'none' }}>
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
                        className="w-100 social-login-btn">
                        <span>🌐</span>
                        Google
                      </Button>
                    </div>
                    <div className="col">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin('Facebook')}
                        className="w-100 social-login-btn">
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