import express from 'express';

import search from './services/search';

const router = express.Router();

console.log('index', index);
router.route('/all')
    .get(search);

export default router;
