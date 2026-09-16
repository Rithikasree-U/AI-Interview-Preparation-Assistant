import express from 'express';
import { uploadResumeHandler, analyzeResumeText } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/upload', uploadResumeHandler);
router.post('/analyze-text', analyzeResumeText);

export default router;
