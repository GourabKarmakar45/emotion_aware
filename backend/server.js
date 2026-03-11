const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with real database in production)
const users = [
  {
    id: 1,
    name: 'Emma',
    email: 'emma@example.com',
    password: '$2a$10$DKxm8kOlz4wY9n/xTJ5XUejZZ9VFt4lkhIcgtd.9DCwHD8uzRqphi' // password: "password123"
  }
];

// User progress storage (in-memory)
const userProgress = {};

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    // Initialize user progress
    userProgress[newUser.id] = {
      quizzes: [],
      lessonsCompleted: [],
      totalStudyTime: 0,
      xpEarned: 0,
      achievements: [],
      emotionHistory: []
    };

    // Generate token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Initialize progress if not exists
    if (!userProgress[user.id]) {
      userProgress[user.id] = {
        quizzes: [],
        lessonsCompleted: [],
        totalStudyTime: 0,
        xpEarned: 0,
        achievements: [],
        emotionHistory: []
      };
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected route example
app.get('/api/user', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email
  });
});

// Save quiz result
app.post('/api/progress/quiz', verifyToken, (req, res) => {
  try {
    const { subject, topic, score, totalQuestions, xpEarned, timeSpent } = req.body;
    
    if (!userProgress[req.userId]) {
      userProgress[req.userId] = {
        quizzes: [],
        lessonsCompleted: [],
        totalStudyTime: 0,
        xpEarned: 0,
        achievements: [],
        emotionHistory: []
      };
    }

    const quizResult = {
      id: Date.now(),
      subject,
      topic,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      xpEarned,
      timeSpent: timeSpent || 0,
      completedAt: new Date().toISOString()
    };

    userProgress[req.userId].quizzes.push(quizResult);
    userProgress[req.userId].xpEarned += xpEarned;

    // Check for achievements
    const quizCount = userProgress[req.userId].quizzes.length;
    const perfectQuizzes = userProgress[req.userId].quizzes.filter(q => q.percentage === 100).length;
    
    if (quizCount >= 1 && !userProgress[req.userId].achievements.includes('first-quiz')) {
      userProgress[req.userId].achievements.push('first-quiz');
    }
    if (perfectQuizzes >= 1 && !userProgress[req.userId].achievements.includes('perfect-score')) {
      userProgress[req.userId].achievements.push('perfect-score');
    }
    if (quizCount >= 5 && !userProgress[req.userId].achievements.includes('quiz-master')) {
      userProgress[req.userId].achievements.push('quiz-master');
    }

    res.json({ success: true, quizResult });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save lesson completion
app.post('/api/progress/lesson', verifyToken, (req, res) => {
  try {
    const { subject, topic, timeSpent } = req.body;
    
    if (!userProgress[req.userId]) {
      userProgress[req.userId] = {
        quizzes: [],
        lessonsCompleted: [],
        totalStudyTime: 0,
        xpEarned: 0,
        achievements: [],
        emotionHistory: []
      };
    }

    const lessonKey = `${subject}-${topic}`;
    
    if (!userProgress[req.userId].lessonsCompleted.includes(lessonKey)) {
      userProgress[req.userId].lessonsCompleted.push(lessonKey);
      userProgress[req.userId].totalStudyTime += timeSpent || 10;
      
      // Check for lesson achievements
      const lessonCount = userProgress[req.userId].lessonsCompleted.length;
      if (lessonCount >= 1 && !userProgress[req.userId].achievements.includes('first-lesson')) {
        userProgress[req.userId].achievements.push('first-lesson');
      }
      if (lessonCount >= 5 && !userProgress[req.userId].achievements.includes('dedicated-learner')) {
        userProgress[req.userId].achievements.push('dedicated-learner');
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save emotion data
app.post('/api/progress/emotion', verifyToken, (req, res) => {
  try {
    const { emotion, confidence, timestamp } = req.body;
    
    if (!userProgress[req.userId]) {
      userProgress[req.userId] = {
        quizzes: [],
        lessonsCompleted: [],
        totalStudyTime: 0,
        xpEarned: 0,
        achievements: [],
        emotionHistory: []
      };
    }

    userProgress[req.userId].emotionHistory.push({
      emotion,
      confidence,
      timestamp: timestamp || new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user analytics/progress
app.get('/api/progress', verifyToken, (req, res) => {
  try {
    const progress = userProgress[req.userId] || {
      quizzes: [],
      lessonsCompleted: [],
      totalStudyTime: 0,
      xpEarned: 0,
      achievements: [],
      emotionHistory: []
    };

    // Calculate analytics
    const totalQuizzes = progress.quizzes.length;
    const averageScore = totalQuizzes > 0 
      ? Math.round(progress.quizzes.reduce((sum, q) => sum + q.percentage, 0) / totalQuizzes)
      : 0;
    
    // Get emotion breakdown
    const emotionCounts = {};
    progress.emotionHistory.forEach(e => {
      emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
    });
    
    const totalEmotions = progress.emotionHistory.length;
    const emotionBreakdown = Object.keys(emotionCounts).map(emotion => ({
      emotion,
      percentage: totalEmotions > 0 ? Math.round((emotionCounts[emotion] / totalEmotions) * 100) : 0,
      color: emotion === 'Focused' ? '#10b981' : emotion === 'Happy' ? '#fbbf24' : emotion === 'Neutral' ? '#6b7280' : emotion === 'Confused' ? '#ef4444' : '#a855f7'
    }));

    // Get most recent quiz
    const recentQuiz = totalQuizzes > 0 
      ? progress.quizzes[progress.quizzes.length - 1]
      : null;

    // Determine focus score based on emotion history
    // Include both 'Focused' and 'Happy' emotions as they both indicate good engagement
    const focusedCount = emotionCounts['Focused'] || 0;
    const happyCount = emotionCounts['Happy'] || 0;
    const focusScore = totalEmotions > 0 
      ? Math.round(((focusedCount + happyCount) / totalEmotions) * 100) 
      : 0;

    res.json({
      totalStudyTime: progress.totalStudyTime,
      focusScore,
      xpEarned: progress.xpEarned,
      topicsCompleted: progress.lessonsCompleted.length,
      quizScore: averageScore,
      totalQuizzes,
      emotionBreakdown,
      recentQuiz,
      achievements: progress.achievements,
      quizHistory: progress.quizzes.slice(-10) // Last 10 quizzes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('\nTest credentials:');
  console.log('Email: emma@example.com');
  console.log('Password: password123');
});

