import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import API from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { PlayCircle, Target, Briefcase, HelpCircle, Award, AlertCircle } from 'lucide-react';

const InterviewSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(user?.targetRole || 'Software Developer');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Fresher');
  const [count, setCount] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleOptions = [
    'Software Developer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
    'Data Scientist',
    'Java Developer',
    'Python Developer',
    'QA Engineer',
  ];

  const typeOptions = ['Technical', 'HR', 'Behavioral', 'Mixed'];
  const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];
  const countOptions = [5, 10, 15];
  const expOptions = ['Fresher', '1–2 Years', '3–5 Years'];

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await API.post('/interviews/start', {
        role,
        interviewType,
        difficulty,
        experienceLevel,
        count: Number(count),
      });

      if (res.data && res.data._id) {
        navigate(`/mock-interview/${res.data._id}`);
      } else {
        setError('Failed to start interview session. Please try again.');
      }
    } catch (err) {
      console.error('[Start Interview Error]', err);
      setError(err.response?.data?.message || 'Failed to initialize mock interview questions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-view">
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 className="text-2xl font-bold">Configure Mock Interview</h1>
              <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
                Select parameters to generate relevant technical and HR questions for your practice session.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="card" style={{ padding: '2rem' }}>
              <form onSubmit={handleStartInterview}>
                {/* JOB ROLE */}
                <div className="form-group">
                  <label className="form-label font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Target size={16} color="var(--primary)" /> Target Job Role
                  </label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* INTERVIEW TYPE & DIFFICULTY */}
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Briefcase size={16} color="var(--primary)" /> Interview Type
                    </label>
                    <select
                      className="form-select"
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value)}
                    >
                      {typeOptions.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Award size={16} color="var(--primary)" /> Difficulty Level
                    </label>
                    <select
                      className="form-select"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      {difficultyOptions.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* EXPERIENCE LEVEL & NUMBER OF QUESTIONS */}
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Briefcase size={16} color="var(--primary)" /> Experience Level
                    </label>
                    <select
                      className="form-select"
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                    >
                      {expOptions.map((x) => (
                        <option key={x} value={x}>{x}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <HelpCircle size={16} color="var(--primary)" /> Number of Questions
                    </label>
                    <select
                      className="form-select"
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                    >
                      {countOptions.map((c) => (
                        <option key={c} value={c}>{c} Questions</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={PlayCircle}
                    loading={loading}
                    style={{ width: '100%' }}
                  >
                    {loading ? 'Preparing Questions...' : 'Start Mock Interview'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewSetup;
