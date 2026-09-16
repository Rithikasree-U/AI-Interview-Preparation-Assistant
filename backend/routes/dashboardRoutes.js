import express from 'express';
import { getStats, getProgressData } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/progress', getProgressData);

export default router;
