import express from 'express';

import getAvailableSubCategory from './services/getAvailableSubCategory';
import getAvailableSubCategories from './services/getAvailableSubCategories';
import getAvailableSubCategoriesByIds from './services/getAvailableSubCategoriesByIds';
import availableSubCategoriesSearch from './services/availableSubCategoriesSearch';

const router = express.Router();

router.route('/')
    .get(getAvailableSubCategory);

router.route('/all')
    .get(getAvailableSubCategories);

router.route('/by-ids')
    .post(getAvailableSubCategoriesByIds);

router.route('/search')
    .get(availableSubCategoriesSearch);

export default router;
