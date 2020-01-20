import express from 'express';

import verification from '../../../middlewares/verification';

import updateSlides from './services/updateSlides';

const router = express.Router();

router.use(verification);

router.route('/update-slides')
    .post(updateSlides);

export default router;
