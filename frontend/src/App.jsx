import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InterviewSetup from './pages/InterviewSetup';
import MockInterview from './pages/MockInterview';
import InterviewResult from './pages/InterviewResult';
import InterviewHistory from './pages/InterviewHistory';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import ResumeUpload from './pages/ResumeUpload';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Candidate Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview/setup" element={<InterviewSetup />} />
            <Route path="/resume-upload" element={<ResumeUpload />} />
            <Route path="/mock-interview/:id" element={<MockInterview />} />
            <Route path="/results/:id" element={<InterviewResult />} />
            <Route path="/history" element={<InterviewHistory />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Fallback wildcard redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
