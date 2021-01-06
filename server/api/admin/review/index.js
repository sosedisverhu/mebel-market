import express from 'express';

import verification from '../../../middlewares/verification';

import getReviews from './services/getReviews';
import editReview from './services/editReview';
import deleteByIds from './services/deleteByIds';

const router = express.Router();

router.use(verification('reviews'));

router.route('/all')
    .get(getReviews);

router.route('/edit')
    .post(editReview);

router.route('/delete-few')
    .post(deleteByIds);

export default router;
