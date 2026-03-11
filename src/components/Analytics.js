import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProgress } from '../services/api';
import './Analytics.css';

const Analytics = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getUserProgress();
        
        // Get last session time from sessionStorage (set when lesson was completed)
        const lastSessionTime = parseInt(sessionStorage.getItem('lastSessionTime') || '0');
        
        // Calculate total study time including current session
        const totalStudyTime = (data.totalStudyTime || 0) + lastSessionTime;
        
        setProgressData({
          ...data,
          totalStudyTime: totalStudyTime
        });
        
        // Clear the session storage after reading
        sessionStorage.removeItem('lastSessionTime');
      } catch (error) {
        console.error('Failed to fetch progress:', error);
        // Use default data if fetch fails
        setProgressData({
          totalStudyTime: 0,
          focusScore: 0,
          xpEarned: 0,
          topicsCompleted: 0,
          quizScore: 0,
          totalQuizzes: 0,
          emotionBreakdown: [],
          achievements: [],
          recentQuiz: null
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgress();
  }, []);

  // Default values for when data is loading or not available
  const sessionData = progressData ? {
    totalTime: `${progressData.totalStudyTime || 0} mins`,
    focusScore: progressData.focusScore || 0,
    xpEarned: progressData.xpEarned || 0,
    topicsCompleted: progressData.topicsCompleted || 0,
    quizScore: progressData.quizScore || 0,
    totalQuizzes: progressData.totalQuizzes || 0
  } : {
    totalTime: '0 mins',
    focusScore: 0,
    xpEarned: 0,
    topicsCompleted: 0,
    quizScore: 0,
    totalQuizzes: 0
  };

  const emotionData = progressData?.emotionBreakdown?.length > 0 
    ? progressData.emotionBreakdown
    : [
      { emotion: 'Focused', percentage: 0, color: '#10b981' },
      { emotion: 'Happy', percentage: 0, color: '#fbbf24' },
      { emotion: 'Neutral', percentage: 0, color: '#6b7280' },
      { emotion: 'Confused', percentage: 0, color: '#ef4444' }
    ];

  const allAchievements = [
    { name: 'First Quiz', icon: '🎯', earned: progressData?.achievements?.includes('first-quiz') || false },
    { name: 'Perfect Score', icon: '💯', earned: progressData?.achievements?.includes('perfect-score') || false },
    { name: 'Quiz Master', icon: '🏆', earned: progressData?.achievements?.includes('quiz-master') || false },
    { name: 'First Lesson', icon: '📚', earned: progressData?.achievements?.includes('first-lesson') || false },
    { name: 'Dedicated Learner', icon: '⭐', earned: progressData?.achievements?.includes('dedicated-learner') || false }
  ];

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <div className="header-content">
            <h1 className="analytics-title">Loading...</h1>
            <p className="analytics-subtitle">Fetching your progress data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div className="header-content">
          <h1 className="analytics-title">Session Complete! 🎉</h1>
          <p className="analytics-subtitle">Here's how you performed</p>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <div className="stat-value">{sessionData.totalTime}</div>
              <div className="stat-label">Study Time</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-value">{sessionData.focusScore}%</div>
              <div className="stat-label">Focus Score</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <div className="stat-value">+{sessionData.xpEarned} XP</div>
              <div className="stat-label">XP Earned</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <div className="stat-value">{sessionData.topicsCompleted}</div>
              <div className="stat-label">Topics Completed</div>
            </div>
          </div>
        </div>

        {/* Emotion Breakdown */}
        <div className="emotion-analysis">
          <h2 className="section-title">😊 Emotion Breakdown</h2>
          <div className="emotion-chart">
            {emotionData.map((item, index) => (
              <div key={index} className="emotion-bar-item">
                <div className="emotion-label-row">
                  <span className="emotion-name">{item.emotion}</span>
                  <span className="emotion-percentage">{item.percentage}%</span>
                </div>
                <div className="emotion-bar-bg">
                  <div 
                    className="emotion-bar-fill"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="emotion-summary">
            <p>You were focused for most of the session! Great job maintaining concentration. 👏</p>
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="quiz-performance">
          <h2 className="section-title">📝 Quiz Performance</h2>
          <div className="quiz-score-circle">
            <svg className="score-svg" viewBox="0 0 100 100">
              <circle
                className="score-bg"
                cx="50"
                cy="50"
                r="40"
              />
              <circle
                className="score-progress"
                cx="50"
                cy="50"
                r="40"
                style={{
                  strokeDashoffset: `${251 - (251 * sessionData.quizScore) / 100}`
                }}
              />
            </svg>
            <div className="score-text">{sessionData.quizScore}%</div>
          </div>
          <p className="quiz-feedback">Excellent! You've mastered the Stack topic! 🌟</p>
        </div>

        {/* Achievements */}
        <div className="achievements-section">
          <h2 className="section-title">🏆 Achievements</h2>
          <div className="achievements-grid">
            {allAchievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-name">{achievement.name}</div>
                {!achievement.earned && <div className="locked-badge">🔒</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations">
          <h2 className="section-title">💡 Recommendations</h2>
          <div className="recommendation-list">
            <div className="recommendation-item">
              <span className="rec-icon">✅</span>
              <span>Great focus! Keep up the consistent study habits.</span>
            </div>
            <div className="recommendation-item">
              <span className="rec-icon">📚</span>
              <span>Ready for the next topic: Queue</span>
            </div>
            <div className="recommendation-item">
              <span className="rec-icon">🎯</span>
              <span>Try studying at this time daily for best results</span>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-actions">
        <button className="secondary-btn" onClick={() => navigate('/subject-selection')}>
          Start New Session
        </button>
        <button className="primary-btn" onClick={() => navigate('/topic-selection')}>
          Continue to Next Topic →
        </button>
      </div>
    </div>
  );
};

export default Analytics;
