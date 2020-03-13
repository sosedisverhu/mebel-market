import express from 'express';

import verification from '../../../middlewares/verification';

import getAllSeo from './services/getAllSeo';
import updateSeo from './services/updateSeo';

const router = express.Router();

router.use(verification('seo'));

router.route('/')
    .get(getAllSeo);

router.route('/update')
    .post(updateSeo);

export default router;
