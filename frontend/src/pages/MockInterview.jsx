import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import QuestionCard from '../components/QuestionCard';
import Button from '../components/Button';
import API from '../services/api';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Clock, Save } from 'lucide-react';

const MockInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [evaluating, setEvaluating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/interviews/${id}`);
        setInterview(res.data);

        // Pre-fill answers if user navigated back or resumed
        const initialAnswers = {};
        if (res.data.answers && Array.isArray(res.data.answers)) {
          res.data.answers.forEach((ans) => {
            initialAnswers[ans.questionId] = ans.userAnswer;
          });
        }
        setUserAnswers(initialAnswers);
      } catch (err) {
        console.error('[Fetch Interview Error]', err);
        setError('We couldn\'t load this interview. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id]);

  const questions = interview?.questions || [];
  const currentQuestion = questions[currentIndex];

  const handleAnswerChange = (text) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id || currentQuestion._id]: text,
    }));
  };

  // Submit current answer to backend
  const saveCurrentAnswer = async () => {
    if (!currentQuestion) return true;
    const qId = currentQuestion.id || currentQuestion._id;
    const answerText = userAnswers[qId] || '';

    try {
      setEvaluating(true);
      setStatusMessage('Evaluating your answer...');
      await API.post(`/interviews/${id}/answer`, {
        questionId: qId,
        userAnswer: answerText,
      });
      return true;
    } catch (err) {
      console.error('[Save Answer Error]', err);
      // Non-blocking fallback warning
      return true;
    } finally {
      setEvaluating(false);
      setStatusMessage('');
    }
  };

  const handleNext = async () => {
    await saveCurrentAnswer();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinish = async () => {
    try {
      setFinishing(true);
      setStatusMessage('Calculating your performance and overall feedback...');
      await saveCurrentAnswer();
      const res = await API.post(`/interviews/${id}/complete`);
      navigate(`/results/${id}`);
    } catch (err) {
      console.error('[Finish Interview Error]', err);
      setError('Failed to complete interview calculation. Please try again.');
    } finally {
      setFinishing(false);
      setStatusMessage('');
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p className="text-muted font-medium">Preparing your interview session...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content" style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error || 'Interview session not found.'}</span>
          </div>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </main>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ padding: '2rem 1.5rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        {/* INTERVIEW HEADER */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-primary font-semibold">{interview.role}</span>
              <span className="badge badge-secondary">{interview.interviewType}</span>
              <span className="badge badge-muted">{interview.difficulty}</span>
            </div>
            <h2 className="text-xl font-bold">Mock Interview Session</h2>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleFinish}
            loading={finishing}
            disabled={evaluating || finishing}
          >
            Finish Interview
          </Button>
        </div>

        {/* PROGRESS BAR */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }} className="text-xs text-muted font-medium">
            <span>Progress: Question {currentIndex + 1} of {questions.length}</span>
            <span>{progressPercent}% Completed</span>
          </div>
          <div className="progress-bar-bg" style={{ height: '8px' }}>
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {statusMessage && (
          <div className="alert alert-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Clock size={16} />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* ACTIVE QUESTION CARD */}
        <QuestionCard
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          question={currentQuestion}
          userAnswer={userAnswers[currentQuestion?.id || currentQuestion?._id] || ''}
          onAnswerChange={handleAnswerChange}
        />

        {/* NAVIGATION CONTROL BAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <Button
            variant="secondary"
            size="md"
            icon={ArrowLeft}
            onClick={handlePrevious}
            disabled={currentIndex === 0 || evaluating || finishing}
          >
            Previous
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              onClick={handleNext}
              loading={evaluating}
              disabled={finishing}
            >
              Next Question
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={CheckCircle2}
              onClick={handleFinish}
              loading={finishing || evaluating}
            >
              Submit & Complete Interview
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default MockInterview;
