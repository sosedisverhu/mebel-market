import express from 'express';

import verification from '../../../middlewares/verification';

import upload from './services/upload';

const router = express.Router();

router.use(verification('products'));

router.route('/upload')
    .post(upload);

export default router;
