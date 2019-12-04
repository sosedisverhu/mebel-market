import express from 'express';

import getBasket from './services/getBasket';
import addProductToBasket from './services/addProductToBasket';
import editProductInBasket from './services/editProductInBasket';
import deleteProductFromBasket from './services/deleteProductFromBasket';

const router = express.Router();

router.route('/')
    .get(getBasket);

router.route('/product')
    .delete(deleteProductFromBasket)
    .put(editProductInBasket)
    .post(addProductToBasket);

export default router;
