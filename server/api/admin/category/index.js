import express from 'express';

import verification from '../../../middlewares/verification';

import getCategories from './services/getCategories';
import saveCategory from './services/saveCategory';
import editCategory from './services/editCategory';
import deleteByIds from './services/deleteByIds';
import findCategoriesByName from './services/findCategoriesByName';
import updateImage from './services/updateImage';

const router = express.Router();

router.use(verification('*'));

router.route('/all')
    .get(getCategories);

router.route('/save')
    .post(saveCategory);

router.route('/edit')
    .post(editCategory);

router.route('/delete')
    .post(deleteByIds);

router.route('/find')
    .get(findCategoriesByName);

router.route('/update-image')
    .post(updateImage);

export default router;
