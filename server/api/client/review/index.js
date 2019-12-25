import express from 'express';

import saveReview from './services/saveReview';

const router = express.Router();

router.route('/new')
    .post(saveReview);

export default router;
