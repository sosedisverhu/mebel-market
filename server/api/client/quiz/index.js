import express from 'express';

import getAvailableQuiz from './services/getAvailableQuiz';
import getAvailableQuizzes from './services/getAvailableQuizzes';
import getAvailableQuizzesByIds from './services/getAvailableQuizzesByIds';

const router = express.Router();

router.route('/')
    .get(getAvailableQuiz);

router.route('/all')
    .get(getAvailableQuizzes);

router.route('/by-ids')
    .post(getAvailableQuizzesByIds);

export default router;
