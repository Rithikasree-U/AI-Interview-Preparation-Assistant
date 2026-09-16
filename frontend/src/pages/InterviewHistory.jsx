import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import InterviewCard from '../components/InterviewCard';
import Button from '../components/Button';
import API from '../services/api';
import { History, PlayCircle, Filter, BookOpen } from 'lucide-react';

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [roleFilter, setRoleFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await API.get('/interviews');
        setInterviews(res.data);
      } catch (err) {
        console.error('[History Fetch Error]', err);
        setError('Failed to fetch interview history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredInterviews = interviews.filter((inv) => {
    if (roleFilter !== 'All' && inv.role !== roleFilter) return false;
    if (typeFilter !== 'All' && inv.interviewType !== typeFilter) return false;
    if (diffFilter !== 'All' && inv.difficulty !== diffFilter) return false;
    return true;
  });

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-view">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
            <div>
              <h1 className="text-2xl font-bold">Interview History</h1>
              <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
                Review past mock sessions, AI evaluation scores, and detailed feedback reports.
              </p>
            </div>

            <Link to="/interview/setup">
              <Button variant="primary" size="md" icon={PlayCircle}>Start New Session</Button>
            </Link>
          </div>

          {/* FILTER BAR */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
              <span className="text-xs font-semibold text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Filter size={14} /> Filter Sessions:
              </span>

              <select className="form-select text-xs" style={{ width: 'auto' }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="All">All Roles</option>
                <option value="Software Developer">Software Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Java Developer">Java Developer</option>
                <option value="Python Developer">Python Developer</option>
              </select>

              <select className="form-select text-xs" style={{ width: 'auto' }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Mixed">Mixed</option>
              </select>

              <select className="form-select text-xs" style={{ width: 'auto' }} value={diffFilter} onChange={(e) => setDiffFilter(e.target.value)}>
                <option value="All">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              {(roleFilter !== 'All' || typeFilter !== 'All' || diffFilter !== 'All') && (
                <button
                  onClick={() => { setRoleFilter('All'); setTypeFilter('All'); setDiffFilter('All'); }}
                  className="btn btn-secondary btn-sm text-xs"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p className="text-muted font-medium">Loading interview history...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : filteredInterviews.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {filteredInterviews.map((inv) => (
                <InterviewCard key={inv._id} interview={inv} />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <BookOpen size={44} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
              <h3 className="text-lg font-semibold">
                {interviews.length === 0 ? "You haven't completed an interview yet." : "No interviews match your filter criteria."}
              </h3>
              <p className="text-xs text-muted" style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
                {interviews.length === 0
                  ? 'Start your first mock interview to build your practice log and track technical progress.'
                  : 'Try adjusting your role or interview type filters.'}
              </p>
              {interviews.length === 0 && (
                <Link to="/interview/setup">
                  <Button variant="primary" size="lg" icon={PlayCircle}>Start Your First Interview</Button>
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InterviewHistory;
