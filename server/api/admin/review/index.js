import express from 'express';

import verification from '../../../middlewares/verification';

import getReviews from './services/getReviews';
import editReview from './services/editReview';

const router = express.Router();

router.use(verification);

router.route('/all')
    .get(getReviews);

router.route('/edit')
    .post(editReview);

export default router;
