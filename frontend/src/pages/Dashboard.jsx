import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import InterviewCard from '../components/InterviewCard';
import Button from '../components/Button';
import API from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { PlayCircle, CheckCircle, BarChart3, HelpCircle, TrendingUp, Award, ArrowRight, BookOpen } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await API.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('[Dashboard Fetch Error]', err);
        setError('Could not load dashboard statistics. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-view">
          {/* Welcome Header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
            <div>
              <h1 className="text-2xl font-bold">
                {getGreeting()}, {user?.name || 'Candidate'}
              </h1>
              <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
                Targeting <span className="font-semibold text-primary">{user?.targetRole || 'Software Developer'}</span> ({user?.experienceLevel || 'Fresher'})
              </p>
            </div>

            <Link to="/interview/setup">
              <Button variant="primary" size="lg" icon={PlayCircle}>
                Start New Interview
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p className="text-muted font-medium">Loading your performance metrics...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              {/* REAL STATISTICS GRID */}
              <div className="grid-stats">
                <StatCard
                  title="Interviews Completed"
                  value={stats?.interviewsCompleted || 0}
                  subtitle="Finished mock sessions"
                  icon={CheckCircle}
                  color="var(--primary)"
                />
                <StatCard
                  title="Average Score"
                  value={`${stats?.averageScore || 0}%`}
                  subtitle="Across all completed interviews"
                  icon={Award}
                  color="var(--secondary)"
                />
                <StatCard
                  title="Questions Practiced"
                  value={stats?.questionsPracticed || 0}
                  subtitle="Total technical & HR answers"
                  icon={HelpCircle}
                  color="#8b5cf6"
                />
                <StatCard
                  title="Current Improvement"
                  value={`${stats?.currentImprovement >= 0 ? '+' : ''}${stats?.currentImprovement || 0}%`}
                  subtitle="Since initial interview session"
                  icon={TrendingUp}
                  trend={stats?.currentImprovement}
                  color="var(--success)"
                />
              </div>

              <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
                {/* SKILL ANALYSIS BREAKDOWN */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-base font-semibold">Skill Analysis</h3>
                    <span className="text-xs text-muted">Category performance</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {stats?.skillAnalysis && stats.skillAnalysis.length > 0 ? (
                      stats.skillAnalysis.map((skill) => (
                        <div key={skill.category}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }} className="text-xs">
                            <span className="font-medium">{skill.category}</span>
                            <span className="font-semibold text-muted">{skill.percentage}%</span>
                          </div>
                          <div className="progress-bar-bg">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${skill.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted" style={{ padding: '1rem 0' }}>
                        Complete your first interview session to view real category breakdown skills.
                      </p>
                    )}
                  </div>
                </div>

                {/* QUICK START / GUIDANCE CARD */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div className="card-header">
                      <h3 className="text-base font-semibold">Practice Readiness</h3>
                      <span className="badge badge-primary text-xs">AI Powered</span>
                    </div>

                    <p className="text-sm text-muted" style={{ lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      InterviewMate AI evaluates your answers on technical depth, accuracy, relevance, and communication clarity. Practice regularly to build muscle memory for technical rounds.
                    </p>

                    <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                      <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>Recommended Strategy</span>
                      <p className="text-xs font-medium" style={{ marginTop: '0.25rem', color: 'var(--text-main)' }}>
                        Take a 5-question technical interview daily focused on core concepts in {user?.targetRole || 'Software Development'}.
                      </p>
                    </div>
                  </div>

                  <Link to="/interview/setup">
                    <Button variant="secondary" size="md" icon={ArrowRight} style={{ width: '100%' }}>
                      Configure Session Parameters
                    </Button>
                  </Link>
                </div>
              </div>

              {/* RECENT INTERVIEWS SECTION */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-base font-semibold">Recent Interview Sessions</h3>
                  <Link to="/history" className="text-xs text-primary font-semibold">
                    View All History →
                  </Link>
                </div>

                {stats?.recentInterviews && stats.recentInterviews.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {stats.recentInterviews.map((inv) => (
                      <InterviewCard key={inv._id} interview={inv} />
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                    <BookOpen size={40} color="var(--text-light)" style={{ marginBottom: '0.75rem' }} />
                    <h4 className="text-base font-semibold">You haven't completed an interview yet.</h4>
                    <p className="text-xs text-muted" style={{ marginTop: '0.25rem', marginBottom: '1.25rem' }}>
                      Start your first mock interview session to unlock performance scores and AI feedback.
                    </p>
                    <Link to="/interview/setup">
                      <Button variant="primary" size="md" icon={PlayCircle}>
                        Start Your First Interview
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
