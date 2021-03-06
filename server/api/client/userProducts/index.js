import express from 'express';

import getUserProducts from './services/getUserProducts';
import saveBasketProducts from './services/saveBasketProducts';
import saveWishlistProducts from './services/saveWishlistProducts';
import deleteProductFromWishlist from './services/deleteProductFromWishlist';
import editProductInBasket from './services/editProductInBasket';
import deleteProductFromBasket from './services/deleteProductFromBasket';

const router = express.Router();

router.route('/')
    .get(getUserProducts);

router.route('/basket')
    .post(saveBasketProducts)
    .put(editProductInBasket)
    .delete(deleteProductFromBasket);

router.route('/wishlist')
    .post(saveWishlistProducts)
    .delete(deleteProductFromWishlist);

export default router;
