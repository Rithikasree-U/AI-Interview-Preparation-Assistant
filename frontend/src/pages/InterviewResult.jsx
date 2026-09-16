import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScoreCard from '../components/ScoreCard';
import Button from '../components/Button';
import API from '../services/api';
import { formatDate, getScoreBadgeClass } from '../utils/helpers';
import { Award, CheckCircle2, AlertTriangle, BookOpen, PlayCircle, ArrowLeft, ChevronDown, ChevronUp, MessageSquare, Lightbulb } from 'lucide-react';

const InterviewResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/interviews/${id}`);
        setInterview(res.data);
      } catch (err) {
        console.error('[Fetch Result Error]', err);
        setError('Failed to load interview results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <p className="text-muted font-medium">Fetching your evaluation report...</p>
        </main>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content" style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
          <div className="alert alert-danger">{error || 'Interview session not found.'}</div>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </main>
      </div>
    );
  }

  const { role, interviewType, difficulty, score, completedAt, answers, overallFeedback } = interview;
  const metrics = overallFeedback?.metrics || {};

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-primary font-semibold">{role}</span>
              <span className="badge badge-secondary">{interviewType}</span>
              <span className="badge badge-muted">{difficulty}</span>
              <span className="text-xs text-muted">• Completed on {formatDate(completedAt)}</span>
            </div>
            <h1 className="text-2xl font-bold">Interview Performance Report</h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/interview/setup">
              <Button variant="primary" size="md" icon={PlayCircle}>Practice Again</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="md" icon={ArrowLeft}>Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* OVERALL SCORE & RADAR METRICS CARD */}
        <ScoreCard overallScore={score} metrics={metrics} />

        {/* FEEDBACK SUMMARY & RECOMMENDATIONS */}
        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          {/* Strengths */}
          <div className="card">
            <h3 className="text-base font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--success-text)' }}>
              <CheckCircle2 size={18} color="var(--success)" /> Key Strengths
            </h3>
            <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {overallFeedback?.strengths && overallFeedback.strengths.length > 0 ? (
                overallFeedback.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-muted" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
                    <span>{str}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-muted">Technical problem-solving effort observed.</li>
              )}
            </ul>
          </div>

          {/* Areas to Improve */}
          <div className="card">
            <h3 className="text-base font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--warning-text)' }}>
              <AlertTriangle size={18} color="var(--warning)" /> Areas to Improve
            </h3>
            <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {overallFeedback?.improvements && overallFeedback.improvements.length > 0 ? (
                overallFeedback.improvements.map((imp, idx) => (
                  <li key={idx} className="text-xs text-muted" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>•</span>
                    <span>{imp}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-muted">Elaborate more on practical complexity tradeoffs.</li>
              )}
            </ul>
          </div>
        </div>

        {/* RECOMMENDED TOPICS */}
        {overallFeedback?.recommendedTopics && overallFeedback.recommendedTopics.length > 0 && (
          <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--primary-light)', borderColor: '#99f6e4' }}>
            <h3 className="text-base font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-text)', marginBottom: '0.5rem' }}>
              <BookOpen size={18} /> Recommended Study Topics
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {overallFeedback.recommendedTopics.map((topic, idx) => (
                <span key={idx} className="badge badge-primary font-semibold" style={{ backgroundColor: '#ffffff', color: 'var(--primary-text)' }}>
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* QUESTION BY QUESTION BREAKDOWN */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 className="text-xl font-bold" style={{ marginBottom: '1rem' }}>Detailed Question Review</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {answers && answers.length > 0 ? (
              answers.map((ans, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div key={idx} className="card" style={{ padding: '1.25rem' }}>
                    <div
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', cursor: 'pointer', gap: '1rem' }}
                    >
                      <div>
                        <span className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>
                          Question {idx + 1} • {ans.category || 'General'}
                        </span>
                        <h4 className="text-base font-semibold">{ans.questionText}</h4>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                        <span className={`badge ${getScoreBadgeClass((ans.score || 0) * 10)} font-bold`}>
                          {ans.score || 0} / 10
                        </span>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* USER ANSWER */}
                        <div>
                          <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>Your Answer:</span>
                          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-md)', marginTop: '0.375rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
                            {ans.userAnswer ? ans.userAnswer : <em className="text-muted">No answer submitted for this question.</em>}
                          </div>
                        </div>

                        {/* HUMAN FEEDBACK */}
                        <div style={{ backgroundColor: 'var(--success-bg)', border: '1px solid #a7f3d0', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
                          <span className="text-xs font-semibold" style={{ color: 'var(--success-text)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <MessageSquare size={14} /> Evaluation & Feedback:
                          </span>
                          <p className="text-xs" style={{ color: 'var(--success-text)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                            {ans.feedbackText || ans.strengths?.join('. ') || 'Good response.'}
                          </p>
                        </div>

                        {/* SUGGESTED ANSWER */}
                        <div>
                          <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Lightbulb size={14} color="var(--primary)" /> Ideal Technical Answer:
                          </span>
                          <div style={{ backgroundColor: 'var(--primary-light)', padding: '0.875rem', borderRadius: 'var(--radius-md)', marginTop: '0.375rem', fontSize: '0.875rem', color: 'var(--primary-text)', lineHeight: 1.6 }}>
                            {ans.suggestedAnswer || 'Provide a structured definition followed by core advantages and complexity notes.'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted">No detailed questions saved for this session.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewResult;
