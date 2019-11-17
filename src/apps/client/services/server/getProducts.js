import request from 'superagent';
import base from '../base';

import setProducts from '../../actions/setProducts';

export default function getProducts (req) {
    return dispatch => {
        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/client/product/all`)
                .timeout({
                    deadline: 2000
                })
        )
            .then(products => {
                dispatch(setProducts(products));
            })
            .catch(() => {
                return dispatch(setProducts([]));
            });
    };
}
