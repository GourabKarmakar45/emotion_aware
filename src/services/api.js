const API_URL = '/api';

// Login function
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  } catch (error) {
    throw error;
  }
};

// Register function
export const register = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  } catch (error) {
    throw error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get user analytics/progress - with localStorage fallback
export const getUserProgress = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No token found in localStorage');
      throw new Error('No token found');
    }

    console.log('Fetching progress with token...');
    
    const response = await fetch(`${API_URL}/progress`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Progress response status:', response.status);

    // If backend is unavailable, try to get from localStorage
    if (!response.ok) {
      console.warn('Backend unavailable, using localStorage data');
      const localData = localStorage.getItem('studyProgress');
      if (localData) {
        return JSON.parse(localData);
      }
      throw new Error('Failed to fetch progress');
    }

    const data = await response.json();
    console.log('Progress data received:', data);

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    // Also save to localStorage as backup
    localStorage.setItem('studyProgress', JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('Error fetching user progress:', error.message);
    
    // Try to get from localStorage as fallback
    const localData = localStorage.getItem('studyProgress');
    if (localData) {
      console.log('Using localStorage backup data');
      return JSON.parse(localData);
    }
    
    // Return demo data if nothing available
    return {
      totalStudyTime: 0,
      focusScore: 0,
      xpEarned: 0,
      topicsCompleted: 0,
      quizScore: 0,
      totalQuizzes: 0,
      emotionBreakdown: [
        { emotion: 'Focused', percentage: 0, color: '#10b981' },
        { emotion: 'Happy', percentage: 0, color: '#fbbf24' },
        { emotion: 'Neutral', percentage: 0, color: '#6b7280' },
        { emotion: 'Confused', percentage: 0, color: '#ef4444' }
      ],
      achievements: [],
      recentQuiz: null
    };
  }
};

// Save quiz result with localStorage backup
export const saveQuizResult = async (subject, topic, score, totalQuestions, xpEarned, timeSpent) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/progress/quiz`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, topic, score, totalQuestions, xpEarned, timeSpent }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save quiz result');
    }

    // Also save to localStorage
    const localProgress = JSON.parse(localStorage.getItem('studyProgress') || '{"xpEarned":0,"totalStudyTime":0,"topicsCompleted":0,"quizzes":[]}');
    localProgress.xpEarned = (localProgress.xpEarned || 0) + xpEarned;
    localProgress.quizzes = localProgress.quizzes || [];
    localProgress.quizzes.push({ subject, topic, score, totalQuestions, xpEarned, timeSpent });
    localProgress.quizScore = Math.round((localProgress.quizzes.reduce((sum, q) => sum + (q.score / q.totalQuestions) * 100, 0)) / localProgress.quizzes.length);
    localProgress.totalQuizzes = localProgress.quizzes.length;
    localStorage.setItem('studyProgress', JSON.stringify(localProgress));

    return data;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
};

// Save lesson progress with localStorage backup
export const saveLessonProgress = async (subject, topic, timeSpent) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/progress/lesson`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, topic, timeSpent }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save lesson progress');
    }

    // Also save to localStorage
    const localProgress = JSON.parse(localStorage.getItem('studyProgress') || '{"xpEarned":0,"totalStudyTime":0,"topicsCompleted":0,"lessonsCompleted":[],"emotionBreakdown":[]}');
    localProgress.totalStudyTime = (localProgress.totalStudyTime || 0) + timeSpent;
    localProgress.topicsCompleted = (localProgress.topicsCompleted || 0) + 1;
    localProgress.lessonsCompleted = localProgress.lessonsCompleted || [];
    if (!localProgress.lessonsCompleted.includes(`${subject}-${topic}`)) {
      localProgress.lessonsCompleted.push(`${subject}-${topic}`);
    }
    localStorage.setItem('studyProgress', JSON.stringify(localProgress));

    return data;
  } catch (error) {
    console.error('Error saving lesson progress:', error);
    throw error;
  }
};

// Save emotion data
export const saveEmotionData = async (emotion, confidence) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/progress/emotion`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emotion, confidence }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save emotion data');
    }

    // Also save to localStorage for offline support
    const localProgress = JSON.parse(localStorage.getItem('studyProgress') || '{"emotionHistory":[]}');
    localProgress.emotionHistory = localProgress.emotionHistory || [];
    localProgress.emotionHistory.push({ emotion, confidence, timestamp: new Date().toISOString() });
    
    // Calculate emotion breakdown
    const emotionCounts = {};
    localProgress.emotionHistory.forEach(e => {
      emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
    });
    const totalEmotions = localProgress.emotionHistory.length;
    localProgress.emotionBreakdown = Object.keys(emotionCounts).map(emotionKey => ({
      emotion: emotionKey,
      percentage: Math.round((emotionCounts[emotionKey] / totalEmotions) * 100),
      color: emotionKey === 'Focused' ? '#10b981' : emotionKey === 'Happy' ? '#fbbf24' : emotionKey === 'Neutral' ? '#6b7280' : emotionKey === 'Confused' ? '#ef4444' : '#a855f7'
    }));
    
    // Calculate focus score
    const focusedCount = emotionCounts['Focused'] || 0;
    const happyCount = emotionCounts['Happy'] || 0;
    localProgress.focusScore = totalEmotions > 0 ? Math.round(((focusedCount + happyCount) / totalEmotions) * 100) : 0;
    
    localStorage.setItem('studyProgress', JSON.stringify(localProgress));

    return data;
  } catch (error) {
    console.error('Error saving emotion data:', error);
    // Don't throw - emotion tracking shouldn't break the app
    return null;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Keep studyProgress for next session
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

