import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: "What is a Stack data structure?",
      options: [
        "First In First Out (FIFO)",
        "Last In First Out (LIFO)",
        "Random Access",
        "Sequential Access"
      ],
      correct: 1
    },
    {
      question: "Which operation adds an element to the stack?",
      options: ["Pop", "Push", "Peek", "Delete"],
      correct: 1
    },
    {
      question: "What happens when you try to pop from an empty stack?",
      options: [
        "Returns null",
        "Stack Overflow",
        "Stack Underflow",
        "Returns 0"
      ],
      correct: 2
    },
    {
      question: "Which of these uses Stack internally?",
      options: [
        "Function call recursion",
        "Queue implementation",
        "Array sorting",
        "Hash table"
      ],
      correct: 0
    },
    {
      question: "What is the time complexity of Push operation?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      correct: 2
    }
  ];

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleBackToLesson = () => {
    navigate('/lesson');
  };

  if (showResult) {
    const percentage = (score / questions.length) * 100;
    const xpEarned = score * 20;

    return (
      <div className="quiz-container">
        <div className="quiz-result-card">
          <div className="result-icon">
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
          </div>
          <h2 className="result-title">Quiz Complete!</h2>
          <div className="result-stats">
            <div className="stat-box">
              <div className="stat-value">{score}/{questions.length}</div>
              <div className="stat-label">Correct Answers</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{percentage}%</div>
              <div className="stat-label">Score</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">+{xpEarned} XP</div>
              <div className="stat-label">Earned</div>
            </div>
          </div>
          <div className="result-message">
            {percentage >= 80 && "Excellent work! You've mastered this topic! 🌟"}
            {percentage >= 60 && percentage < 80 && "Good job! Keep practicing! 👏"}
            {percentage < 60 && "Don't worry! Review the topic and try again! 💪"}
          </div>
          <div className="result-actions">
            <button className="retry-btn" onClick={() => window.location.reload()}>
              Retry Quiz
            </button>
            <button className="continue-btn" onClick={() => navigate('/analytics')}>
              View Analytics
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button className="back-btn" onClick={handleBackToLesson}>
          ← Back to Lesson
        </button>
        <div className="quiz-progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div className="quiz-card">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <h2 className="question-text">{questions[currentQuestion].question}</h2>

        <div className="options-list">
          {questions[currentQuestion].options.map((option, index) => (
            <div
              key={index}
              className={`option-item ${selectedAnswer === index ? 'selected' : ''}`}
              onClick={() => handleAnswer(index)}
            >
              <div className="option-radio">
                {selectedAnswer === index && <div className="radio-dot"></div>}
              </div>
              <span className="option-text">{option}</span>
            </div>
          ))}
        </div>

        <button 
          className="next-btn" 
          onClick={handleNext}
          disabled={selectedAnswer === null}
        >
          {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'} →
        </button>
      </div>
    </div>
  );
};

export default Quiz;
