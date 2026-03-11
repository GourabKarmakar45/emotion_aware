# Emotion-Aware Study Assistant

An AI-based learning system that detects student emotions using a webcam and adapts learning content accordingly.

## Complete Application Flow

### 1. Login Page (`/`)
- User enters email and password
- Redirects to Start Study page

### 2. Start Study Page (`/start-study`)
- Welcome screen with app features
- Shows: Smart Learning, Track Progress, Stay Focused
- Click "Start Study Session" button

### 3. Subject Selection (`/subject-selection`)
- Choose from 6 subjects (Data Structures, Algorithms, etc.)
- Click subject card to select
- Click "Continue" button

### 4. Topic Selection (`/topic-selection`)
- Choose specific topic (Stack, Queue, Linked List, etc.)
- Shows difficulty level and duration
- Click topic to select
- Click "Start Lesson" button

### 5. Lesson Page (`/lesson`) - Main Learning Interface
The core learning experience with:
- **Lesson content** divided into sections (Introduction, Operations, Examples)
- **Progress tracking** (Section X of Y, percentage complete)
- **Reading material** with clear explanations
- **Emotion detection panel** (right side) showing:
  - Current emotion (Focused, Happy, Confused, Bored, Sleepy)
  - Confidence percentage
  - Emotion breakdown bars
  - XP tracking
- **Navigation buttons** (Previous/Next)
- **Three adaptive action buttons:**
  - Show Quiz (when bored or want to test knowledge)
  - Simplify Topic (when confused)
  - Take Break (when sleepy or tired)
- **When all sections complete:** Click "Complete Lesson" → Goes to Quiz

### 6. Quiz Page (`/quiz`)
- Interactive quiz with 5 questions about the topic
- Multiple choice answers
- Progress bar
- Score calculation with percentage
- XP rewards based on performance
- Result screen with:
  - Score and correct answers
  - Performance feedback
  - Options: Retry Quiz or View Analytics

### 7. Simplified Content (`/simplified`)
Accessed when user is confused or clicks "Simplify Topic":
- Easy-to-understand explanations
- Real-life analogies (e.g., stack of plates)
- Visual examples and diagrams
- Step-by-step breakdown
- Key points summary
- Options: Take Quiz or Continue Learning

### 8. Break Screen (`/break`)
Accessed when user is sleepy or clicks "Take Break":
- 2-minute countdown timer with circular progress
- Break tips (drink water, stretch, rest eyes, walk around)
- Options: Extend break (+1 minute) or Skip break
- Auto-completes when timer ends
- Returns to Lesson page

### 9. Analytics Dashboard (`/analytics`)
Opens after completing quiz:
- **Session statistics:** Study time, focus score, XP earned, topics completed
- **Emotion breakdown chart:** Shows time spent in each emotion
- **Quiz performance:** Circular score display with feedback
- **Achievements/badges:** Earned and locked badges
- **Personalized recommendations:** Based on performance
- **Options:** 
  - Start New Session (goes to Subject Selection)
  - Continue to Next Topic (goes to Topic Selection)

## Adaptive Learning Logic

The system adapts based on detected emotions:

- **Focused** 😊 → Continue normal lesson, everything flows smoothly
- **Confused** 😕 → "Simplify Topic" button highlighted → Shows easier explanation
- **Bored** 😑 → "Show Quiz" button highlighted → Interactive quiz to engage
- **Sleepy** 😴 → "Take Break" button highlighted → Suggests rest period
- **Happy** 😄 → Continue with positive reinforcement

## Complete User Journey

```
Login 
  ↓
Start Study (Welcome)
  ↓
Subject Selection (Choose subject)
  ↓
Topic Selection (Choose topic)
  ↓
Lesson Page (Read & Learn with emotion detection)
  ├→ Confused? → Simplified Content → Back to Lesson
  ├→ Bored? → Quiz → Analytics
  ├→ Sleepy? → Break Screen → Back to Lesson
  └→ Complete Lesson → Quiz → Analytics
       ↓
Analytics (View performance)
  ├→ Start New Session → Subject Selection
  └→ Next Topic → Topic Selection
```

## Setup

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Demo Login Credentials

```
Email: emma@example.com
Password: password123
```

## Tech Stack

- **Frontend:** React.js, React Router
- **Styling:** CSS (custom)
- **Backend:** Python (Flask/FastAPI) - to be integrated
- **AI/ML:** OpenCV, TensorFlow/PyTorch, CNN - to be integrated
- **Database:** MongoDB/Firebase - to be integrated

## Features

✅ User authentication
✅ Subject and topic selection
✅ Live webcam feed (UI ready)
✅ Emotion detection display (UI ready)
✅ Interactive quizzes
✅ Simplified content explanations
✅ Break reminders
✅ Progress tracking (XP, badges)
✅ Analytics dashboard
✅ Adaptive learning flow

## Next Steps (Backend Integration)

1. Connect webcam to emotion detection AI model
2. Implement real-time emotion analysis
3. Add user authentication with database
4. Store session data and analytics
5. Implement XP and badge system
6. Add more subjects and topics
7. Create teacher/admin dashboard

## Goal

Provide stress-free learning by:
- Detecting when students struggle
- Automatically simplifying content
- Making learning fun with quizzes
- Preventing burnout with breaks
- Tracking progress and motivation
