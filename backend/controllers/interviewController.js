import Interview from '../models/Interview.js';
import InterviewFeedback from '../models/InterviewFeedback.js';
import { generateQuestions, evaluateUserAnswer, generateFinalFeedback } from '../services/aiService.js';
import { calculateInterviewScore } from '../services/interviewService.js';

// @desc    Start new mock interview session
// @route   POST /api/interviews/start
// @access  Private
export const startInterview = async (req, res) => {
  try {
    const { role, interviewType, difficulty, experienceLevel, count } = req.body;

    const numQuestions = Number(count) || 5;
    const selectedRole = role || req.user.targetRole || 'Software Developer';
    const selectedType = interviewType || 'Technical';
    const selectedDiff = difficulty || 'Intermediate';
    const selectedExp = experienceLevel || req.user.experienceLevel || 'Fresher';

    // Generate questions using AI or local database fallback
    const questions = await generateQuestions({
      role: selectedRole,
      interviewType: selectedType,
      difficulty: selectedDiff,
      experienceLevel: selectedExp,
      count: numQuestions,
    });

    const interview = await Interview.create({
      userId: req.user._id,
      role: selectedRole,
      interviewType: selectedType,
      difficulty: selectedDiff,
      experienceLevel: selectedExp,
      questions,
      answers: [],
      score: 0,
      completed: false,
      startedAt: new Date(),
    });

    return res.status(201).json(interview);
  } catch (error) {
    console.error('[Start Interview Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to initialize interview' });
  }
};

// @desc    Get user's interview history
// @route   GET /api/interviews
// @access  Private
export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    return res.json(interviews);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific interview by ID
// @route   GET /api/interviews/:id
// @access  Private
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json(interview);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Submit single answer for AI evaluation
// @route   POST /api/interviews/:id/answer
// @access  Private
export const submitAnswer = async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Locate question in interview
    const targetQ = interview.questions.find((q) => q.id === questionId || (q._id && q._id.toString() === questionId));
    if (!targetQ) {
      return res.status(400).json({ message: 'Question not found in interview session' });
    }

    // Evaluate answer with AI / Fallback engine
    const evaluation = await evaluateUserAnswer({
      questionText: targetQ.question,
      category: targetQ.category || 'General',
      userAnswer: userAnswer || '',
      role: interview.role,
      difficulty: interview.difficulty,
      expectedAnswer: targetQ.expectedAnswer,
    });

    const answerObj = {
      questionId,
      questionText: targetQ.question,
      category: targetQ.category || 'General',
      userAnswer: userAnswer || '',
      score: evaluation.score,
      correctness: evaluation.correctness,
      relevance: evaluation.relevance,
      technicalKnowledge: evaluation.technicalKnowledge,
      communication: evaluation.communication,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      suggestedAnswer: evaluation.suggestedAnswer,
      feedbackText: evaluation.strengths.join('. ') + '. ' + evaluation.improvements.join('. '),
    };

    // Replace existing answer if re-submitted, or push new answer
    const existingIndex = interview.answers.findIndex((a) => a.questionId === questionId);
    if (existingIndex > -1) {
      interview.answers[existingIndex] = answerObj;
    } else {
      interview.answers.push(answerObj);
    }

    await interview.save();

    // Create Feedback record in InterviewFeedback collection
    await InterviewFeedback.create({
      interviewId: interview._id,
      questionId,
      userAnswer: userAnswer || '',
      score: evaluation.score,
      correctness: evaluation.correctness,
      relevance: evaluation.relevance,
      technicalKnowledge: evaluation.technicalKnowledge,
      communication: evaluation.communication,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      suggestedAnswer: evaluation.suggestedAnswer,
    });

    return res.json({
      message: 'Answer saved and evaluated successfully',
      answer: answerObj,
      interview,
    });
  } catch (error) {
    console.error('[Submit Answer Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to process answer evaluation' });
  }
};

// @desc    Complete interview & calculate final feedback and stats
// @route   POST /api/interviews/:id/complete
// @access  Private
export const completeInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Calculate score metrics
    const { overallScore, metrics } = calculateInterviewScore(interview.answers);

    // Generate final AI feedback summary
    const summaryFeedback = await generateFinalFeedback({
      role: interview.role,
      interviewType: interview.interviewType,
      questions: interview.questions,
      evaluatedAnswers: interview.answers,
    });

    interview.score = overallScore;
    interview.completed = true;
    interview.completedAt = new Date();
    interview.overallFeedback = {
      strengths: summaryFeedback.strengths || [],
      improvements: summaryFeedback.improvements || [],
      recommendedTopics: summaryFeedback.recommendedTopics || [],
      summary: summaryFeedback.summary || 'Interview completed successfully.',
      metrics,
    };

    await interview.save();

    return res.json(interview);
  } catch (error) {
    console.error('[Complete Interview Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to complete interview session' });
  }
};
