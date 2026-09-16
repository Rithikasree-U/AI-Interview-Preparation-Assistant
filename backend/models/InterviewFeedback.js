import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      index: true,
    },
    questionId: {
      type: String,
      required: true,
    },
    userAnswer: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      default: 0,
    },
    correctness: {
      type: Number,
      default: 0,
    },
    relevance: {
      type: Number,
      default: 0,
    },
    technicalKnowledge: {
      type: Number,
      default: 0,
    },
    communication: {
      type: Number,
      default: 0,
    },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    suggestedAnswer: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const InterviewFeedback = mongoose.model('InterviewFeedback', feedbackSchema);
export default InterviewFeedback;
