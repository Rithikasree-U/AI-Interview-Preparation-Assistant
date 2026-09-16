import Question from '../models/Question.js';

// @desc    Get questions with filtering
// @route   GET /api/questions
// @access  Public / Private
export const getQuestions = async (req, res) => {
  try {
    const { category, role, difficulty, interviewType } = req.query;
    const query = {};

    if (category) query.category = category;
    if (role) query.role = role;
    if (difficulty) query.difficulty = difficulty;
    if (interviewType) query.interviewType = interviewType;

    const questions = await Question.find(query).limit(50);
    return res.json(questions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get random questions
// @route   GET /api/questions/random
// @access  Public / Private
export const getRandomQuestions = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 5;
    const questions = await Question.aggregate([{ $sample: { size: count } }]);
    return res.json(questions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
