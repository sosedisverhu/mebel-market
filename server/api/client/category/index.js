import express from 'express';

import getAvailableCategories from './services/getAvailableCategories';
import getAvailableCategoriesByIds from './services/getAvailableCategoriesByIds';

const router = express.Router();

router.route('/all')
    .get(getAvailableCategories);

router.route('/by-ids')
    .post(getAvailableCategoriesByIds);

export default router;
