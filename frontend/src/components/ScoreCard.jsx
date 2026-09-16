import React from 'react';
import { getScoreColor } from '../utils/helpers';
import { Award, CheckCircle2, MessageSquare, Target, Lightbulb } from 'lucide-react';

const ScoreCard = ({ overallScore, metrics }) => {
  const scoreColor = getScoreColor(overallScore);

  const metricItems = [
    { label: 'Technical Knowledge', value: metrics?.technicalKnowledge || 0, icon: Target },
    { label: 'Communication', value: metrics?.communication || 0, icon: MessageSquare },
    { label: 'Relevance', value: metrics?.relevance || 0, icon: CheckCircle2 },
    { label: 'Accuracy', value: metrics?.accuracy || 0, icon: Award },
    { label: 'Problem Solving', value: metrics?.problemSolving || 0, icon: Lightbulb },
  ];

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        {/* Score Circle / Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: 'var(--radius-full)',
            border: `6px solid ${scoreColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-main)',
            flexShrink: 0,
          }}>
            <span className="text-2xl font-bold" style={{ color: 'var(--text-main)', lineHeight: 1 }}>
              {overallScore}
            </span>
            <span className="text-xs text-muted font-medium">/ 100</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Overall Evaluation
            </span>
            <h3 className="text-xl font-bold" style={{ marginTop: '0.125rem' }}>
              {overallScore >= 80 ? 'Excellent Performance' : overallScore >= 60 ? 'Good Practice Session' : 'Needs Technical Review'}
            </h3>
            <p className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>
              Based on answer accuracy, technical depth, and communication clarity.
            </p>
          </div>
        </div>

        {/* Metric Bar Breakdown */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {metricItems.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }} className="text-xs">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 500 }}>
                    <Icon size={13} color="var(--primary)" /> {m.label}
                  </span>
                  <span className="font-semibold">{m.value}%</span>
                </div>
                <div className="progress-bar-bg" style={{ height: '6px' }}>
                  <div className="progress-bar-fill" style={{ width: `${m.value}%`, backgroundColor: getScoreColor(m.value) }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
