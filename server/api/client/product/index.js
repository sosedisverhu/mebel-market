import express from 'express';

import getAvailableProduct from './services/getAvailableProduct';
import getAvailableProducts from './services/getAvailableProducts';
import getAvailableProductsByIds from './services/getAvailableProductsByIds';
import availableProductsSearch from './services/availableProductsSearch';

const router = express.Router();

router.route('/')
    .get(getAvailableProduct);

router.route('/all')
    .get(getAvailableProducts);

router.route('/by-ids')
    .post(getAvailableProductsByIds);

router.route('/find')
    .get(availableProductsSearch);

export default router;
