import request from 'superagent';
import base from '../base';

import setSubCategories from '../../actions/setSubCategories';

export default function getSubCategories (req) {
    return dispatch => {
        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/client/subCategory/all`)
                .timeout({
                    deadline: 2000
                })
        )
            .then(subCategories => {
                dispatch(setSubCategories(subCategories));
            })
            .catch(() => {
                dispatch(setSubCategories([]));
            });
    };
}
