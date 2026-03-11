import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import './Logout.css';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="logout-overlay">
      <div className="logout-modal">
        <div className="logout-icon">🚪</div>
        <h2 className="logout-title">Log Out</h2>
        <p className="logout-message">Are you sure you want to log out?</p>
        <p className="logout-subtitle">You'll need to log in again to continue your study session.</p>
        
        <div className="logout-buttons">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={handleLogout}>
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;

