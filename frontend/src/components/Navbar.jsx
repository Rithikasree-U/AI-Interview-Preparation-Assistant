import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Award, LogOut, User, Menu, X, Play, BarChart2, Clock, Home } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.875rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '1.125rem'
          }}>
            IM
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-main)', display: 'block', lineHeight: 1.1 }}>
              InterviewMate <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>AI</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          {!isAuthenticated ? (
            <>
              <Link to="/" className="text-sm font-medium" style={{ color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)' }}>Home</Link>
              <a href="#features" className="text-sm font-medium text-muted">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-muted">How It Works</a>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Start Practicing</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-sm font-medium" style={{ color: isActive('/dashboard') ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Home size={16} /> Dashboard
              </Link>
              <Link to="/interview/setup" className="text-sm font-medium" style={{ color: isActive('/interview/setup') ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Play size={16} /> Start Mock
              </Link>
              <Link to="/history" className="text-sm font-medium" style={{ color: isActive('/history') ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Clock size={16} /> History
              </Link>
              <Link to="/progress" className="text-sm font-medium" style={{ color: isActive('/progress') ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <BarChart2 size={16} /> Analytics
              </Link>
              
              <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border)' }}></div>

              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </Link>

              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout" style={{ padding: '0.375rem 0.625rem' }}>
                <LogOut size={16} />
              </button>
            </>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }}
          className="mobile-toggle"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {!isAuthenticated ? (
            <>
              <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary">Start Practicing</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link to="/interview/setup" onClick={() => setMobileOpen(false)}>Start Mock Interview</Link>
              <Link to="/history" onClick={() => setMobileOpen(false)}>Interview History</Link>
              <Link to="/progress" onClick={() => setMobileOpen(false)}>Progress & Analytics</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
