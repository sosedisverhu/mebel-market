import request from 'superagent';
import base from '../base';

import setProducts from '../../actions/setProducts';

export default function getProducts () {
    return dispatch => {
        return base(
            request
                .get('/api/client/product/all')
        )
            .then(products => {
                dispatch(setProducts(products));
            })
            .catch(() => {
                return dispatch(setProducts([]));
            });
    };
}
