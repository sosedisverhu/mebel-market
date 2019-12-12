import request from 'superagent';
import base from '../base';

import setCategories from '../../actions/setCategories';

export default function getCategories (req) {
    return dispatch => {
        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/client/category/all`)
                .timeout({
                    deadline: 2000
                })
        )
            .then(categories => {
                dispatch(setCategories(categories));
            })
            .catch(() => {
                dispatch(setCategories([]));
            });
    };
}
