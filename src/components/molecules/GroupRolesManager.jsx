import React, { useState } from 'react';

function GroupRolesManager({ onRolesUpdate }) {
  const [showRoleSetup, setShowRoleSetup] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('editor');
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [error, setError] = useState('');

  const roleDefinitions = {
    admin: {
      title: 'מנהל',
      badge: 'bg-danger',
      description: 'יכול לנהל את הקבוצה (חוץ מהיוצר)'
    },
    editor: {
      title: 'עורך',
      badge: 'bg-warning text-dark',
      description: 'יכול לערוך תוכן ולאשר חברים'
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddRole = () => {
    if (!emailInput.trim()) {
      setError('יש להזין כתובת אימייל');
      return;
    }

    if (!validateEmail(emailInput)) {
      setError('כתובת אימייל לא תקינה');
      return;
    }

    const exists = assignedRoles.find(r => r.email === emailInput);
    if (exists) {
      setError('משתמש זה כבר קיבל תפקיד');
      return;
    }

    const newRole = {
      email: emailInput,
      role: selectedRole,
      ...roleDefinitions[selectedRole]
    };

    const updatedRoles = [...assignedRoles, newRole];
    setAssignedRoles(updatedRoles);
    onRolesUpdate?.(updatedRoles);
    
    setEmailInput('');
    setError('');
  };

  const handleRemoveRole = (email) => {
    const updatedRoles = assignedRoles.filter(r => r.email !== email);
    setAssignedRoles(updatedRoles);
    onRolesUpdate?.(updatedRoles);
  };

  if (!showRoleSetup) {
    return (
      <div className="border rounded p-3 mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-1">הגדרת תפקידים</h6>
            <small className="text-muted">
              תוכל להוסיף מנהלים ועורכים מאוחר יותר דרך הגדרות הקבוצה
            </small>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowRoleSetup(true)}
          >
            הגדר עכשיו
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded p-3 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">הגדרת תפקידים</h6>
        <button
          type="button"
          className="btn btn-sm btn-link text-muted"
          onClick={() => setShowRoleSetup(false)}
        >
          סגור
        </button>
      </div>

      {/* הסבר על התפקידים */}
      <div className="bg-light rounded p-2 mb-3 small">
        <div className="mb-2">
          <strong>יוצר הקבוצה:</strong> כל ההרשאות + מחיקת קבוצה
        </div>
        <div className="mb-2">
          <strong>מנהל:</strong> ניהול מלא (חוץ מהיוצר)
        </div>
        <div>
          <strong>עורך:</strong> עריכת תוכן ואישור חברים
        </div>
      </div>

      {/* טופס הוספת תפקיד */}
      <div className="input-group mb-2">
        <input
          type="email"
          className="form-control"
          placeholder="כתובת אימייל"
          value={emailInput}
          onChange={(e) => {
            setEmailInput(e.target.value);
            setError('');
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleAddRole()}
        />
        <select
          className="form-select"
          style={{ maxWidth: '120px' }}
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="admin">מנהל</option>
          <option value="editor">עורך</option>
        </select>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddRole}
        >
          הוסף
        </button>
      </div>

      {error && (
        <div className="text-danger small mb-2">{error}</div>
      )}

      {/* רשימת תפקידים שהוגדרו */}
      {assignedRoles.length > 0 && (
        <div className="mt-3">
          <small className="text-muted d-block mb-2">תפקידים שהוגדרו:</small>
          {assignedRoles.map((role, index) => (
            <div key={index} className="d-flex align-items-center justify-content-between bg-light rounded p-2 mb-1">
              <div className="d-flex align-items-center">
                <span className={`badge ${role.badge} me-2`}>
                  {role.title}
                </span>
                <small>{role.email}</small>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-link text-danger p-0"
                onClick={() => handleRemoveRole(role.email)}
              >
                הסר
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupRolesManager;