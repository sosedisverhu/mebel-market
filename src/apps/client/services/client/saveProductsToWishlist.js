import request from 'superagent';
import base from '../base';
import Cookies from 'js-cookie';
import { COOKIE_USER_PRODUCT_ID } from '../../constants/constants';

export default function saveProductsToWishlist (productsIds) {
    return () => {
        const id = Cookies.get(COOKIE_USER_PRODUCT_ID);

        return base(
            request
                .post(`/api/client/user-products/save-wishlist`)
                .query({ id })
                .send(productsIds)
        );
    };
}
