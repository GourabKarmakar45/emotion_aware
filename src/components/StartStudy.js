import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartStudy.css';

const StartStudy = () => {
  const navigate = useNavigate();

  return (
    <div className="start-study-container">
      <div className="start-study-header">
        <div className="brain-icon">
          <svg viewBox="0 0 100 100" className="brain-svg">
            <path
              d="M30 20 Q20 20 20 30 Q20 40 25 45 Q20 50 20 60 Q20 70 30 70 L30 80 Q30 90 40 90 L60 90 Q70 90 70 80 L70 70 Q80 70 80 60 Q80 50 75 45 Q80 40 80 30 Q80 20 70 20 Q65 20 60 25 Q55 20 50 20 Q45 20 40 25 Q35 20 30 20 Z"
              fill="none"
              stroke="url(#brainGradient)"
              strokeWidth="2"
            />
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

      <div className="start-study-card">
        <h2 className="welcome-title">Welcome, Emma! 👋</h2>
        <p className="welcome-subtitle">Ready to start your learning journey?</p>
        
        <div className="study-info">
          <div className="info-item">
            <span className="info-icon">📚</span>
            <div className="info-text">
              <h3>Smart Learning</h3>
              <p>AI adapts to your emotions</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🎯</span>
            <div className="info-text">
              <h3>Track Progress</h3>
              <p>Earn XP and badges</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🧠</span>
            <div className="info-text">
              <h3>Stay Focused</h3>
              <p>Real-time emotion detection</p>
            </div>
          </div>
        </div>

        <button className="start-btn" onClick={() => navigate('/subject-selection')}>
          Start Study Session
        </button>
      </div>
    </div>
  );
};

export default StartStudy;
