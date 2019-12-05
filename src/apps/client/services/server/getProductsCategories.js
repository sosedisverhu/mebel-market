import request from 'superagent';
import base from '../base';

import setNewsCategories from '../../actions/setProductsCategories';

export default function getCategories (req) {
    return dispatch => {
        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/client/productsCategory/all`)
                .timeout({
                    deadline: 2000
                })
        )
            .then(categories => {
                dispatch(setNewsCategories(categories));
            })
            .catch(() => {
                dispatch(setNewsCategories([]));
            });
    };
}