import express from 'express';

import getSlides from './services/getSlides';

const router = express.Router();

router.route('/slides')
    .get(getSlides);

export default router;
