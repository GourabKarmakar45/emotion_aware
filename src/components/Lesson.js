import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { lessonContent } from '../data/lessonContent';
import './Lesson.css';

const Lesson = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subject = location.state?.subject || { name: 'Data Structures' };
  const topic = location.state?.topic || { name: 'Stack' };
  
  const [currentSection, setCurrentSection] = useState(0);

  // Get lesson sections for the selected topic
  const lessonSections = lessonContent[topic.name]?.sections || lessonContent['Stack'].sections;

  const handleNext = () => {
    if (currentSection < lessonSections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // Lesson complete, go to quiz
      navigate('/quiz');
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleShowQuiz = () => {
    navigate('/quiz');
  };

  const handleSimplify = () => {
    navigate('/simplified');
  };

  const handleTakeBreak = () => {
    navigate('/break');
  };

  return (
    <div className="lesson-container">
      {/* Sidebar */}
      <aside className="lesson-sidebar">
        <div className="logo-section">
          <div className="brain-logo">
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
          <div className="logo-text">
            <span>Emotion-Aware Study</span>
            <span className="gradient-text">Assistant</span>
          </div>
        </div>

        <nav className="nav-menu">
          <a href="#dashboard" className="nav-item">
            <span className="nav-icon">📊</span>
            Dashboard
          </a>
          <a href="#live-session" className="nav-item active">
            <span className="nav-icon">▶️</span>
            Live Session
          </a>
          <a href="#lessons" className="nav-item">
            <span className="nav-icon">📚</span>
            Lessons
          </a>
          <a href="#quizzes" className="nav-item">
            <span className="nav-icon">📝</span>
            Quizzes
          </a>
          <a href="#analytics" className="nav-item">
            <span className="nav-icon">📈</span>
            Analytics
          </a>
          <a href="#settings" className="nav-item">
            <span className="nav-icon">⚙️</span>
            Settings
          </a>
          <a href="#logout" className="nav-item">
            <span className="nav-icon">🚪</span>
            Logout
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lesson-main">
        {/* Header */}
        <header className="lesson-header">
          <h1 className="page-title">{topic.name} - {subject.name}</h1>
          <div className="header-actions">
            <div className="user-welcome">
              <img src="https://i.pravatar.cc/40?img=5" alt="User" className="user-avatar" />
              <span>Welcome, <strong>Emma</strong>!</span>
            </div>
            <button className="icon-btn notification-btn">
              🔔
              <span className="notification-badge"></span>
            </button>
            <button className="icon-btn settings-btn">⚙️</button>
          </div>
        </header>

        <div className="lesson-content-wrapper">
          {/* Lesson Content */}
          <div className="lesson-content-area">
            {/* Progress */}
            <div className="lesson-progress-bar">
              <div className="progress-info">
                <span>Section {currentSection + 1} of {lessonSections.length}</span>
                <span className="progress-percent">{Math.round(((currentSection + 1) / lessonSections.length) * 100)}% Complete</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentSection + 1) / lessonSections.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Lesson Section */}
            <div className="lesson-section">
              <div className="section-icon">{lessonSections[currentSection].image}</div>
              <h2 className="section-title">{lessonSections[currentSection].title}</h2>
              <div className="section-content">
                {lessonSections[currentSection].content.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="lesson-navigation">
              <button 
                className="nav-btn prev-btn" 
                onClick={handlePrevious}
                disabled={currentSection === 0}
              >
                ← Previous
              </button>
              <button 
                className="nav-btn next-btn" 
                onClick={handleNext}
              >
                {currentSection === lessonSections.length - 1 ? 'Complete Lesson' : 'Next →'}
              </button>
            </div>
          </div>

          {/* Emotion Sidebar */}
          <aside className="emotion-panel">
            <div className="emotion-card">
              <div className="card-header">
                <span className="card-icon">🧠</span>
                Emotion Detection
                <div className="emotion-wave">📊</div>
              </div>

              <div className="current-emotion">
                <div className="emotion-icon large">😊</div>
                <div className="emotion-info">
                  <div className="emotion-label">Emotion: <strong className="emotion-value">Focused</strong></div>
                  <div className="confidence-label">Confidence: <strong>89%</strong></div>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: '89%' }}></div>
                  </div>
                </div>
              </div>

              <div className="emotion-breakdown">
                <div className="emotion-row">
                  <span className="emotion-emoji">😊</span>
                  <span className="emotion-name">Happy</span>
                  <div className="emotion-bar">
                    <div className="emotion-bar-fill" style={{ width: '5%', backgroundColor: '#fbbf24' }}></div>
                  </div>
                  <span className="emotion-percent">5%</span>
                </div>
                <div className="emotion-row">
                  <span className="emotion-emoji">😐</span>
                  <span className="emotion-name">Neutral</span>
                  <div className="emotion-bar">
                    <div className="emotion-bar-fill" style={{ width: '3%', backgroundColor: '#fbbf24' }}></div>
                  </div>
                  <span className="emotion-percent">3%</span>
                </div>
                <div className="emotion-row">
                  <span className="emotion-emoji">😕</span>
                  <span className="emotion-name">Confused</span>
                  <div className="emotion-bar">
                    <div className="emotion-bar-fill" style={{ width: '0%', backgroundColor: '#ef4444' }}></div>
                  </div>
                  <span className="emotion-percent">0%</span>
                </div>
                <div className="emotion-row">
                  <span className="emotion-emoji">😑</span>
                  <span className="emotion-name">Bored</span>
                  <div className="emotion-bar">
                    <div className="emotion-bar-fill" style={{ width: '0%', backgroundColor: '#a855f7' }}></div>
                  </div>
                  <span className="emotion-percent">0%</span>
                </div>
                <div className="emotion-row">
                  <span className="emotion-emoji">😴</span>
                  <span className="emotion-name">Sleepy</span>
                  <div className="emotion-bar">
                    <div className="emotion-bar-fill" style={{ width: '0%', backgroundColor: '#a855f7' }}></div>
                  </div>
                  <span className="emotion-percent">0%</span>
                </div>
              </div>

              <div className="xp-earned">
                <div className="xp-info">
                  <span className="xp-icon">⭐</span>
                  <span className="xp-text">+80 XP Earned</span>
                </div>
                <div className="xp-time">
                  <span className="fire-icon">🔥</span>
                  <span>23 mins • 44 mins</span>
                </div>
              </div>
              <div className="xp-progress-bar">
                <div className="xp-progress-fill"></div>
              </div>

              <div className="action-buttons">
                <button className="action-btn" onClick={handleShowQuiz}>Show Quiz</button>
                <button className="action-btn" onClick={handleSimplify}>Simplify Topic</button>
                <button className="action-btn primary" onClick={handleTakeBreak}>Take Break</button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Lesson;
