import express from 'express';

import getAvailableProduct from './services/getAvailableProduct';
import getAvailableProducts from './services/getAvailableProducts';
import getAvailableProductsByIds from './services/getAvailableProductsByIds';
import availableProductsSearch from './services/availableProductsSearch';
import addProductViews from './services/addProductViews';

const router = express.Router();

router.route('/')
    .get(getAvailableProduct);

router.route('/all')
    .get(getAvailableProducts);

router.route('/by-ids')
    .post(getAvailableProductsByIds);

router.route('/find')
    .get(availableProductsSearch);

router.route('/views')
    .get(addProductViews);

export default router;
