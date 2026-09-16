import express from 'express';
import { getQuestions, getRandomQuestions } from '../controllers/questionController.js';

const router = express.Router();

router.get('/', getQuestions);
router.get('/random', getRandomQuestions);

export default router;
