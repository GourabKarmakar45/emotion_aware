import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import StartStudy from './components/StartStudy';
import SubjectSelection from './components/SubjectSelection';
import TopicSelection from './components/TopicSelection';
import Lesson from './components/Lesson';
import Quiz from './components/Quiz';
import SimplifiedContent from './components/SimplifiedContent';
import BreakScreen from './components/BreakScreen';
import Analytics from './components/Analytics';
import Logout from './components/Logout';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/start-study" element={<StartStudy />} />
        <Route path="/subject-selection" element={<SubjectSelection />} />
        <Route path="/topic-selection" element={<TopicSelection />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/simplified" element={<SimplifiedContent />} />
        <Route path="/break" element={<BreakScreen />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
