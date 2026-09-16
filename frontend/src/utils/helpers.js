export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getScoreBadgeClass = (score) => {
  if (score >= 80) return 'badge-success';
  if (score >= 60) return 'badge-warning';
  return 'badge-danger';
};

export const getScoreColor = (score) => {
  if (score >= 80) return 'var(--success)';
  if (score >= 60) return 'var(--warning)';
  return 'var(--danger)';
};

export const formatPercentage = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '0%';
  return `${Math.round(num)}%`;
};
