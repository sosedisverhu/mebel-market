import express from 'express';

import saveReview from './services/saveReview';
import getAvailableReviews from './services/getAvailableReviews';

const router = express.Router();

router.route('/new')
    .post(saveReview);

router.route('/all')
    .get(getAvailableReviews);

export default router;
