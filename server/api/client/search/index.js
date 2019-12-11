import express from 'express';

import search from './services/search';

const router = express.Router();

router.route('/')
    .get(search);

export default router;
