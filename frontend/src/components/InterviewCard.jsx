import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getScoreBadgeClass } from '../utils/helpers';
import { Briefcase, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

const InterviewCard = ({ interview }) => {
  const { _id, role, interviewType, difficulty, score, completedAt, createdAt, questions, completed } = interview;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'border-color 0.15s ease' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <span className="badge badge-primary text-xs" style={{ marginBottom: '0.375rem' }}>
              {interviewType}
            </span>
            <h4 className="text-base font-semibold">{role}</h4>
          </div>
          {completed ? (
            <span className={`badge ${getScoreBadgeClass(score)} text-sm font-bold`}>
              {score}/100
            </span>
          ) : (
            <span className="badge badge-muted text-xs">In Progress</span>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }} className="text-xs text-muted">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Briefcase size={13} /> {difficulty}
          </span>
          <span>•</span>
          <span>{questions?.length || 0} Questions</span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={13} /> {formatDate(completedAt || createdAt)}
          </span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <Link to={`/results/${_id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
          <span>View Result</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default InterviewCard;
