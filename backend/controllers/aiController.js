import { generateQuestions, evaluateUserAnswer, generateFinalFeedback } from '../services/aiService.js';

// @desc    Direct AI Question Generation endpoint
// @route   POST /api/ai/generate-questions
// @access  Private
export const generateQuestionsApi = async (req, res) => {
  try {
    const { role, interviewType, difficulty, experienceLevel, count } = req.body;
    const questions = await generateQuestions({ role, interviewType, difficulty, experienceLevel, count });
    return res.json({ questions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Direct AI Answer Evaluation endpoint
// @route   POST /api/ai/evaluate-answer
// @access  Private
export const evaluateAnswerApi = async (req, res) => {
  try {
    const { questionText, category, userAnswer, role, difficulty, expectedAnswer } = req.body;
    const evaluation = await evaluateUserAnswer({ questionText, category, userAnswer, role, difficulty, expectedAnswer });
    return res.json(evaluation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Direct AI Feedback Generation endpoint
// @route   POST /api/ai/generate-feedback
// @access  Private
export const generateFeedbackApi = async (req, res) => {
  try {
    const { role, interviewType, questions, evaluatedAnswers } = req.body;
    const feedback = await generateFinalFeedback({ role, interviewType, questions, evaluatedAnswers });
    return res.json(feedback);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
