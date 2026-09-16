import express from 'express';
import { generateQuestionsApi, evaluateAnswerApi, generateFeedbackApi } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/generate-questions', generateQuestionsApi);
router.post('/evaluate-answer', evaluateAnswerApi);
router.post('/generate-feedback', generateFeedbackApi);

export default router;
