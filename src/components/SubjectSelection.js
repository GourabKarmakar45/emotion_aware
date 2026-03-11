import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubjectSelection.css';

const SubjectSelection = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = [
    { id: 1, name: 'Data Structures', icon: '🗂️', topics: 12 },
    { id: 2, name: 'Algorithms', icon: '⚙️', topics: 15 },
    { id: 3, name: 'Web Development', icon: '🌐', topics: 20 },
    { id: 4, name: 'Machine Learning', icon: '🤖', topics: 18 },
    { id: 5, name: 'Database Systems', icon: '💾', topics: 10 },
    { id: 6, name: 'Operating Systems', icon: '💻', topics: 14 }
  ];

  const handleContinue = () => {
    if (selectedSubject) {
      navigate('/topic-selection', { state: { subject: selectedSubject } });
    }
  };

  return (
    <div className="subject-selection-container">
      <div className="selection-header">
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
        <h1 className="page-title">Select Your Subject</h1>
      </div>

      <div className="subjects-grid">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className={`subject-card ${selectedSubject?.id === subject.id ? 'selected' : ''}`}
            onClick={() => setSelectedSubject(subject)}
          >
            <div className="subject-icon">{subject.icon}</div>
            <h3 className="subject-name">{subject.name}</h3>
            <p className="subject-topics">{subject.topics} Topics</p>
          </div>
        ))}
      </div>

      <div className="selection-actions">
        <button className="back-btn" onClick={() => navigate('/start-study')}>
          ← Back
        </button>
        <button 
          className="continue-btn" 
          onClick={handleContinue}
          disabled={!selectedSubject}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default SubjectSelection;
