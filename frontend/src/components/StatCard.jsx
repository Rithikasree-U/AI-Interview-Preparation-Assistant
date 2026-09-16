import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'var(--primary)' }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem' }}>
      {Icon && (
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: `${color}15`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={24} />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.125rem' }}>
          <h3 className="text-2xl font-bold">{value}</h3>
          {trend && (
            <span className={`text-xs font-medium ${trend >= 0 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '0.125rem 0.375rem', borderRadius: '4px' }}>
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
