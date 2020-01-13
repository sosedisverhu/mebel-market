import request from 'superagent';
import base from '../base';

import setBasket from '../../actions/setBasket';

export default function deleteFromBasket (basketItemId) {
    return dispatch => {
        return base(
            request
                .delete('/api/client/user-products/basket')
                .query({ basketItemId })
        )
            .then(({ basket }) => {
                dispatch(setBasket(basket));
            })
            .catch(() => {
                dispatch(setBasket([]));
            });
    };
}
