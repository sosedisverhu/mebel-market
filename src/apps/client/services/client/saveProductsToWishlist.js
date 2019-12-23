import request from 'superagent';
import base from '../base';

import setWishlist from '../../actions/setWishlist';

export default function saveProductsToWishlist (payload) {
    return dispatch => {
        return base(
            request
                .post('/api/client/user-products/wishlist')
                .send(payload)
        )
            .then(({ wishlist }) => {
                dispatch(setWishlist(wishlist));
            })
            .catch(() => {
                dispatch(setWishlist([]));
            });
    };
}
