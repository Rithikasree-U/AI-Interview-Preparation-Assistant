import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  category: { type: String, default: 'General' },
  userAnswer: { type: String, default: '' },
  score: { type: Number, default: 0 },
  correctness: { type: Number, default: 0 },
  relevance: { type: Number, default: 0 },
  technicalKnowledge: { type: Number, default: 0 },
  communication: { type: Number, default: 0 },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  suggestedAnswer: { type: String, default: '' },
  feedbackText: { type: String, default: '' },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    interviewType: {
      type: String,
      required: true,
      enum: ['Technical', 'HR', 'Behavioral', 'Mixed'],
      default: 'Technical',
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    experienceLevel: {
      type: String,
      default: 'Fresher',
    },
    questions: [
      {
        id: String,
        question: String,
        category: String,
        difficulty: String,
        expectedAnswer: String,
      },
    ],
    answers: [answerSchema],
    score: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    overallFeedback: {
      strengths: [{ type: String }],
      improvements: [{ type: String }],
      recommendedTopics: [{ type: String }],
      summary: { type: String, default: '' },
      metrics: {
        technicalKnowledge: { type: Number, default: 0 },
        communication: { type: Number, default: 0 },
        relevance: { type: Number, default: 0 },
        accuracy: { type: Number, default: 0 },
        problemSolving: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
