import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GroupSearchPage from './pages/GroupSearchPage';
import UserSearchPage from './pages/UserSearchPage';
import CreateGroupPage from './pages/CreateGroupPage';

// דף ראשי ריק
function HomePage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
         style={{ 
           background: 'linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)'
         }}>
      <div className="text-center">
        <h1 className="text-white display-3 fw-bold mb-4">ברוכים הבאים</h1>
        <p className="text-white lead">נווט ידנית לדפים על ידי שינוי ה-URL</p>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* כל הדפים עצמאיים - ללא ניווט ביניהם */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/groups" element={<GroupSearchPage />} />
          <Route path="/users" element={<UserSearchPage />} />
          <Route path="/create-group" element={<CreateGroupPage />} />
          
          {/* 404 */}
          <Route path="*" element={
            <div className="min-vh-100 d-flex align-items-center justify-content-center" 
                 style={{ 
                   background: 'linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)'
                 }}>
              <div className="text-center">
                <h1 className="text-white display-1 fw-bold mb-4">404</h1>
                <p className="text-white lead mb-5">הדף שחיפשת לא נמצא</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;