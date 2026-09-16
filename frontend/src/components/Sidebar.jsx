import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlayCircle, History, TrendingUp, Settings, Target, Briefcase, FileUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'New Interview', path: '/interview/setup', icon: PlayCircle },
    { label: 'Resume-Based Setup', path: '/resume-upload', icon: FileUp },
    { label: 'Interview History', path: '/history', icon: History },
    { label: 'Progress & Analytics', path: '/progress', icon: TrendingUp },
    { label: 'Profile Settings', path: '/profile', icon: Settings },
  ];

  return (
    <aside style={{
      width: '240px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid var(--border)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 'calc(100vh - 64px)',
    }} className="sidebar-container">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ padding: '0 0.5rem 1rem 0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
          <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Candidate Portal
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium`
              }
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                transition: 'all 0.15s ease',
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* User Info Card */}
      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        padding: '0.875rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
          <Target size={14} color="var(--primary)" />
          <span className="text-xs font-semibold text-muted">Target Profile</span>
        </div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-main)', lineHeight: 1.2 }}>
          {user?.targetRole || 'Software Developer'}
        </p>
        <span className="badge badge-muted text-xs" style={{ marginTop: '0.375rem', display: 'inline-block' }}>
          {user?.experienceLevel || 'Fresher'}
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
