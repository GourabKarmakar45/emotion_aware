import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple validation - in production, add proper authentication
    if (email && password) {
      navigate('/start-study');
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="brain-icon">
          <svg viewBox="0 0 100 100" className="brain-svg">
            <path
              d="M30 20 Q20 20 20 30 Q20 40 25 45 Q20 50 20 60 Q20 70 30 70 L30 80 Q30 90 40 90 L60 90 Q70 90 70 80 L70 70 Q80 70 80 60 Q80 50 75 45 Q80 40 80 30 Q80 20 70 20 Q65 20 60 25 Q55 20 50 20 Q45 20 40 25 Q35 20 30 20 Z"
              fill="none"
              stroke="url(#brainGradient)"
              strokeWidth="2"
            />
            <circle cx="35" cy="35" r="3" fill="#a855f7" />
            <circle cx="50" cy="30" r="3" fill="#a855f7" />
            <circle cx="65" cy="35" r="3" fill="#a855f7" />
            <circle cx="40" cy="50" r="3" fill="#ec4899" />
            <circle cx="60" cy="50" r="3" fill="#ec4899" />
            <line x1="35" y1="35" x2="50" y2="30" stroke="#a855f7" strokeWidth="1" />
            <line x1="50" y1="30" x2="65" y2="35" stroke="#a855f7" strokeWidth="1" />
            <line x1="35" y1="35" x2="40" y2="50" stroke="#a855f7" strokeWidth="1" />
            <line x1="65" y1="35" x2="60" y2="50" stroke="#ec4899" strokeWidth="1" />
            <defs>
              <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 className="app-title">
          Emotion-Aware <span className="gradient-text">Study Assistant</span>
        </h1>
      </div>

      <div className="login-card">
        <h2 className="login-title">Login</h2>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <a href="/forgot-password" className="forgot-password">
          Forgot Password?
        </a>

        <div className="signup-link">
          New to the platform? <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
