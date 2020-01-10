import request from 'superagent';
import base from '../base';

import setBasket from '../../actions/setBasket';

export default function editProductInBasket (payload) {
    return dispatch => {
        return base(
            request
                .put('/api/client/user-products/basket')
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
