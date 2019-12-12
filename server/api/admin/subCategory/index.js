import express from 'express';

import verification from '../../../middlewares/verification';

import getSubCategories from './services/getSubCategories';
import saveSubCategory from './services/saveSubCategory';
import editSubCategory from './services/editSubCategory';
import deleteByIds from './services/deleteByIds';
import findSubCategoriesByName from './services/findSubCategoriesByName';

const router = express.Router();

router.use(verification);

router.route('/all')
    .get(getSubCategories);

router.route('/save')
    .post(saveSubCategory);

router.route('/edit')
    .post(editSubCategory);

router.route('/delete-few')
    .post(deleteByIds);

router.route('/find')
    .get(findSubCategoriesByName);

export default router;
