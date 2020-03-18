import express from 'express';

import verification from '../../../middlewares/verification';

import getProducts from './services/getProducts';
import saveProduct from './services/saveProduct';
import editProduct from './services/editProduct';
import deleteByIds from './services/deleteByIds';
import updateFiles from './services/updateFiles';
import updateAvatar from './services/updateAvatar';
import updateColor from './services/updateColor';
import findProductsByName from './services/findProductsByName';
import editPositions from './services/editProductsPositions';

const router = express.Router();

router.use(verification);

router.route('/all')
    .get(getProducts);

router.route('/save')
    .post(saveProduct);

router.route('/edit')
    .post(editProduct);

router.route('/delete-few')
    .post(deleteByIds);

router.route('/update-files')
    .post(updateFiles);

router.route('/update-avatar')
    .post(updateAvatar);

router.route('/update-color')
    .post(updateColor);

router.route('/find')
    .get(findProductsByName);

router.route('/edit-positions')
    .post(editPositions);

export default router;
