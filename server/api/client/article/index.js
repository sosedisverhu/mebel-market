import express from 'express';

import getAvailableArticle from './services/getAvailableArticle';
import getAvailableArticles from './services/getAvailableArticles';
import getAvailableArticlesByIds from './services/getAvailableArticlesByIds';
import availableArticlesSearch from './services/availableArticlesSearch';

const router = express.Router();

router.route('/')
    .get(getAvailableArticle);

router.route('/all')
    .get(getAvailableArticles);

router.route('/by-ids')
    .post(getAvailableArticlesByIds);

router.route('/search')
    .get(availableArticlesSearch);

export default router;
