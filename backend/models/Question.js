import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      default: 'General',
      index: true,
    },
    interviewType: {
      type: String,
      enum: ['Technical', 'HR', 'Behavioral', 'Mixed'],
      default: 'Technical',
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
      index: true,
    },
    expectedAnswer: {
      type: String,
      required: true,
    },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model('Question', questionSchema);
export default Question;
