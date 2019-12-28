import express from 'express';

import getAllSeo from './services/getAllSeo';

const router = express.Router();

router.route('/')
    .get(getAllSeo);

export default router;
