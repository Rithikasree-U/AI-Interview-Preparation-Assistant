import React from 'react';
import { HelpCircle, Tag, Award } from 'lucide-react';

const QuestionCard = ({
  currentIndex,
  totalQuestions,
  question,
  userAnswer,
  onAnswerChange,
}) => {
  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-secondary font-semibold" style={{ fontSize: '0.8125rem' }}>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          {question?.category && (
            <span className="badge badge-muted text-xs">
              <Tag size={12} /> {question.category}
            </span>
          )}
        </div>
        {question?.difficulty && (
          <span className="badge badge-primary text-xs">
            {question.difficulty}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-main)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
          {question?.question}
        </h3>
        <p className="text-xs text-muted">
          Answer clearly and structure your technical reasoning. Take your time to cover key concepts and practical application.
        </p>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label font-medium" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Your Answer</span>
          <span className="text-xs text-muted">
            {userAnswer ? `${userAnswer.trim().split(/\s+/).length} words` : '0 words'}
          </span>
        </label>
        <textarea
          className="form-textarea"
          rows={6}
          placeholder="Type your response here... Include definitions, code logic, or architectural principles where applicable."
          value={userAnswer || ''}
          onChange={(e) => onAnswerChange(e.target.value)}
          style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}
        />
      </div>
    </div>
  );
};

export default QuestionCard;
