import express from 'express';

import verification from '../../../middlewares/verification';

import getQuizzes from './services/getQuizzes';
import saveQuiz from './services/saveQuiz';
import editQuiz from './services/editQuiz';
import deleteByIds from './services/deleteByIds';
import updateLogo from './services/updateLogo';
import findQuizzesByName from './services/findQuizzesByName';

const router = express.Router();

router.use(verification);

router.route('/all')
    .get(getQuizzes);

router.route('/save')
    .post(saveQuiz);

router.route('/edit')
    .post(editQuiz);

router.route('/delete-few')
    .post(deleteByIds);

router.route('/update-logo')
    .post(updateLogo);

router.route('/find')
    .get(findQuizzesByName);

export default router;
