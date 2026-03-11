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

// Save quiz result
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

    return data;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
};

// Save lesson completion
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

    return data;
  } catch (error) {
    console.error('Error saving emotion data:', error);
    // Don't throw - emotion tracking shouldn't break the app
    return null;
  }
};

// Get user analytics/progress
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

    const data = await response.json();
    console.log('Progress data received:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch progress');
    }

    // Ensure we have valid data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    return data;
  } catch (error) {
    console.error('Error fetching user progress:', error.message);
    console.warn('Falling back to demo data - backend may be unavailable');
    // Return demo data as fallback when backend is unavailable
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

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
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
