import request from 'superagent';
import base from '../base';

import setWishlist from '../../actions/setWishlist';

export default function deleteFromWishlist (wishlistItemId) {
    return dispatch => {
        return base(
            request
                .delete('/api/client/user-products/wishlist')
                .query({ wishlistItemId })
        )
            .then(({ wishlist }) => {
                dispatch(setWishlist(wishlist));
            })
            .catch(() => {
                dispatch(setWishlist([]));
            });
    };
}
