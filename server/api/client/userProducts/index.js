import express from 'express';

import getUserProducts from './services/getUserProducts';
import saveBasketProducts from './services/saveBasketProducts';
import saveWishlistProducts from './services/saveWishlistProducts';

const router = express.Router();

router.route('/')
    .get(getUserProducts);

router.route('/save-wishlist')
    .post(saveWishlistProducts);

export default router;
