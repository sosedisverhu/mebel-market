import request from 'superagent';
import base from '../base';

import { COOKIE_USER_PRODUCT_ID, COOKIE_YEARS } from '../../constants/constants';

import setBasket from '../../actions/setBasket';
import setWishlist from '../../actions/setWishlist';

export default function getUserProducts (req, res) {
    return dispatch => {
        const host = req.get('host');
        const id = req.cookies[COOKIE_USER_PRODUCT_ID];

        return base(
            request
                .get(`${host}/api/client/user-products`)
                .query({ id })
                .timeout({
                    deadline: 2000
                })
        )
            .then(({ id, basket, wishlist }) => {
                const expires = new Date();

                expires.setFullYear(expires.getFullYear() + COOKIE_YEARS);
                res.cookie(COOKIE_USER_PRODUCT_ID, id, { expires });

                dispatch(setBasket(basket));
                dispatch(setWishlist(wishlist));
            })
            .catch(() => {
                dispatch(setBasket([]));
                dispatch(setWishlist([]));
            });
    };
}
