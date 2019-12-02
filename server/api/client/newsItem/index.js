import express from 'express';

import getAvailableNewsItem from './services/getAvailableNewsItem';
import getAvailableNews from './services/getAvailableNews';
import getAvailableNewsByIds from './services/getAvailableNewsByIds';
import availableNewsSearch from './services/availableNewsSearch';

const router = express.Router();

router.route('/')
    .get(getAvailableNewsItem);

router.route('/all')
    .get(getAvailableNews);

router.route('/by-ids')
    .post(getAvailableNewsByIds);

router.route('/search')
    .get(availableNewsSearch);

export default router;
