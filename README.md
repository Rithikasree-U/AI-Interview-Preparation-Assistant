# InterviewMate AI

> **Subtitle:** Practice smarter. Interview better.

InterviewMate AI is a production-style, full-stack MERN application designed to help software engineering students and job seekers prepare for technical and HR interviews with confidence.

---

## Key Features

- **Role-Based Mock Interviews**: Select target role (Software Developer, Frontend, Backend, Full Stack, Data Analyst, Data Scientist, Java, Python, QA Engineer), difficulty, experience level, and interview type (Technical, HR, Behavioral, Mixed).
- **AI-Powered Evaluation**: Google Gemini API evaluates candidate answers on technical correctness, relevance, communication clarity, and confidence.
- **Robust Local Fallback System**: If Gemini API key is missing or unavailable, the application seamlessly utilizes a local database question bank and algorithmic scoring logic without interrupting practice sessions.
- **Human-Like Feedback**: Receive constructive, student-friendly feedback with strengths, missing concepts, and suggested ideal answers.
- **Performance Analytics & Radar Metrics**: Track overall scores, 5 core evaluation metrics (Technical Knowledge, Communication, Relevance, Accuracy, Problem Solving), and skill domain mastery percentage.
- **Interview History & Review**: Filter past interviews by role, type, and difficulty, and inspect question-by-question responses.
- **JWT Authentication & Profile Management**: Secure user registration, password hashing (bcryptjs), profile updates, and password changes.

---

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios (with JWT interceptors)
- **Styling**: Vanilla CSS (Human SaaS aesthetic with custom design tokens)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas / Mongoose
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **AI Integration**: Google Generative AI (`@google/generative-ai`)

---

## Project Structure

```
interview-prep/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── interviewController.js
│   │   ├── questionController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Interview.js
│   │   ├── InterviewFeedback.js
│   │   ├── Question.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── interviewRoutes.js
│   │   ├── questionRoutes.js
│   │   └── userRoutes.js
│   ├── seed/
│   │   └── seedQuestions.js
│   ├── services/
│   │   ├── aiService.js
│   │   └── interviewService.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── InterviewCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── ScoreCard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── StatCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── InterviewHistory.jsx
│   │   │   ├── InterviewResult.jsx
│   │   │   ├── InterviewSetup.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MockInterview.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Progress.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .env.example
└── README.md
```

---

## Installation & Setup

### Prerequisites
- **Node.js**: v18+ installed
- **MongoDB**: Local MongoDB instance running OR MongoDB Atlas Connection URI.

### 1. Environment Configuration

Create `.env` inside `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/interviewmate
JWT_SECRET=interviewmate_jwt_secret_production_key_9988
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Create `.env` inside `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 2. Backend Setup & Question Seeding

```bash
cd backend
npm install
npm run seed
npm run dev
```

The backend server will run on `http://localhost:5000`.

---

### 3. Frontend Setup & Run

In a new terminal tab:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will open on `http://localhost:5173`.

---

## API Endpoint Overview

### Auth Endpoints
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authenticate user & receive JWT
- `GET /api/auth/me` - Verify current user session

### Interview Endpoints
- `POST /api/interviews/start` - Initialize mock interview session
- `GET /api/interviews` - Fetch user interview history
- `GET /api/interviews/:id` - Fetch single interview session & details
- `POST /api/interviews/:id/answer` - Submit and evaluate single answer
- `POST /api/interviews/:id/complete` - Finalize interview session & compute feedback

### Dashboard & Analytics
- `GET /api/dashboard/stats` - Fetch real user stats, recent interviews, & skill breakdown
- `GET /api/dashboard/progress` - Fetch score timeline & improvement insights

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile info
- `PUT /api/users/change-password` - Change password

---

## License & Copyright

© 2026 InterviewMate AI. Designed and developed for technical interview preparation.
