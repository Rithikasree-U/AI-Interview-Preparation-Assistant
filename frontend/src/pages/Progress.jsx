import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import API from '../services/api';
import { TrendingUp, Award, BarChart2, BookOpen, PlayCircle, CheckCircle2 } from 'lucide-react';

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const res = await API.get('/dashboard/progress');
        setProgress(res.data);
      } catch (err) {
        console.error('[Progress Fetch Error]', err);
        setError('Failed to fetch progress metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchProgressData();
  }, []);

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-view">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
            <div>
              <h1 className="text-2xl font-bold">Progress & Performance Analytics</h1>
              <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
                Track your score improvements, category strengths, and technical growth across mock sessions.
              </p>
            </div>

            <Link to="/interview/setup">
              <Button variant="primary" size="md" icon={PlayCircle}>Start New Session</Button>
            </Link>
          </div>

          {loading ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p className="text-muted font-medium">Calculating your analytical insights...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : progress?.totalCount < 2 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <BarChart2 size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <h3 className="text-xl font-bold">Complete a few interviews to see your progress.</h3>
              <p className="text-sm text-muted" style={{ marginTop: '0.5rem', marginBottom: '1.5rem', maxWidth: '500px', margin: '0.5rem auto 1.5rem auto' }}>
                {progress?.insightMessage || 'You need at least 2 completed interview sessions to generate historical performance comparisons.'}
              </p>
              <Link to="/interview/setup">
                <Button variant="primary" size="lg" icon={PlayCircle}>Start Mock Interview</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* INSIGHT BANNER */}
              <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--primary-light)', borderColor: '#99f6e4', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#ffffff',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-bold" style={{ color: 'var(--primary-text)', textTransform: 'uppercase' }}>Performance Insight</span>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--primary-text)', marginTop: '0.125rem' }}>
                      {progress.insightMessage}
                    </h3>
                  </div>
                </div>
              </div>

              {/* SCORE HISTORY CHRONOLOGY */}
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-header">
                  <h3 className="text-base font-semibold">Score Progression Across Sessions</h3>
                  <span className="text-xs text-muted">{progress.totalCount} Sessions Completed</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {progress.scoreHistory.map((item) => (
                    <div key={item.interviewIndex} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                      <span className="text-xs font-semibold text-muted" style={{ width: '90px' }}>
                        {item.date}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }} className="text-xs">
                          <span className="font-medium">{item.role} ({item.type})</span>
                          <span className="font-bold">{item.score}%</span>
                        </div>
                        <div className="progress-bar-bg" style={{ height: '8px' }}>
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${item.score}%`,
                              backgroundColor: item.score >= 80 ? 'var(--success)' : item.score >= 60 ? 'var(--warning)' : 'var(--danger)',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SKILL MASTERY BREAKDOWN */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-base font-semibold">Skill Domain Mastery</h3>
                  <span className="text-xs text-muted">Aggregated accuracy</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {progress.skillBreakdown.map((skill) => (
                    <div key={skill.category} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                        <span className="text-sm font-semibold">{skill.category}</span>
                        <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{skill.percentage}%</span>
                      </div>
                      <div className="progress-bar-bg" style={{ height: '6px', marginBottom: '0.5rem' }}>
                        <div className="progress-bar-fill" style={{ width: `${skill.percentage}%` }} />
                      </div>
                      <span className="text-xs text-muted">{skill.practicedCount} questions answered</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Progress;
