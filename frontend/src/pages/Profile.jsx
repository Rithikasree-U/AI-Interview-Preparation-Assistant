import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import API from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { User, Lock, Save, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile, logout } = useAuth();

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Software Developer');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Fresher');

  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

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

  const expOptions = ['Fresher', '1–2 Years', '3–5 Years'];

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: '', type: '' });

    try {
      setProfileLoading(true);
      await updateUserProfile({ name, targetRole, experienceLevel });
      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setProfileMsg({ text: err.response?.data?.message || 'Failed to update profile.', type: 'danger' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', type: 'danger' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'New password must be at least 6 characters long.', type: 'danger' });
      return;
    }

    try {
      setPasswordLoading(true);
      await API.put('/users/change-password', { currentPassword, newPassword });
      setPasswordMsg({ text: 'Password updated successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setPasswordMsg({ text: err.response?.data?.message || 'Failed to update password.', type: 'danger' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-view">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 className="text-2xl font-bold">Account & Profile Settings</h1>
              <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
                Update your personal details, career target role, and account credentials.
              </p>
            </div>

            {/* AVATAR HEADER CARD */}
            <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 700,
                flexShrink: 0
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-lg font-bold">{user?.name}</h3>
                <p className="text-xs text-muted" style={{ marginTop: '0.125rem' }}>{user?.email}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span className="badge badge-primary text-xs">{user?.targetRole}</span>
                  <span className="badge badge-muted text-xs">{user?.experienceLevel}</span>
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '1.5rem' }}>
              {/* PROFILE FORM */}
              <div className="card">
                <h3 className="text-base font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <User size={18} color="var(--primary)" /> Profile Information
                </h3>

                {profileMsg.text && (
                  <div className={`alert alert-${profileMsg.type}`} style={{ padding: '0.625rem', fontSize: '0.8125rem' }}>
                    {profileMsg.text}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address (Read-only)</label>
                    <input
                      type="email"
                      className="form-control text-muted"
                      value={user?.email || ''}
                      disabled
                      style={{ backgroundColor: 'var(--bg-subtle)' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Role</label>
                    <select
                      className="form-select"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                    >
                      {roleOptions.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Experience Level</label>
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

                  <Button type="submit" variant="primary" size="md" icon={Save} loading={profileLoading} style={{ width: '100%', marginTop: '0.5rem' }}>
                    Save Changes
                  </Button>
                </form>
              </div>

              {/* CHANGE PASSWORD & LOGOUT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card">
                  <h3 className="text-base font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <Lock size={18} color="var(--primary)" /> Change Password
                  </h3>

                  {passwordMsg.text && (
                    <div className={`alert alert-${passwordMsg.type}`} style={{ padding: '0.625rem', fontSize: '0.8125rem' }}>
                      {passwordMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="New password (min 6 chars)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" variant="secondary" size="md" loading={passwordLoading} style={{ width: '100%' }}>
                      Update Password
                    </Button>
                  </form>
                </div>

                <div className="card" style={{ borderColor: '#fca5a5' }}>
                  <h4 className="text-base font-semibold" style={{ color: 'var(--danger-text)', marginBottom: '0.25rem' }}>Session Management</h4>
                  <p className="text-xs text-muted" style={{ marginBottom: '1rem' }}>
                    Sign out of your account on this browser.
                  </p>
                  <Button variant="outline" size="md" icon={LogOut} onClick={logout} style={{ color: 'var(--danger-text)', borderColor: 'var(--danger-text)' }}>
                    Log Out of InterviewMate AI
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
