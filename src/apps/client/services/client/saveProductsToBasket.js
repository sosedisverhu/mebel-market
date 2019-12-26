import request from 'superagent';
import base from '../base';

import setBasket from '../../actions/setBasket';

export default function saveProductsToBasket (payload) {
    return dispatch => {
        return base(
            request
                .post('/api/client/user-products/basket')
                .send(payload)
        )
            .then(({ basket }) => {
                dispatch(setBasket(basket));
            })
            .catch(() => {
                dispatch(setBasket([]));
            });
    };
}
