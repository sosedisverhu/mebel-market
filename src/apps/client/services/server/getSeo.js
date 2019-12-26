import request from 'superagent';
import base from '../base';

import setSeo from '../../actions/setSeo';

export default function getSeo (req) {
    return dispatch => {
        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/client/seo`)
                .timeout({
                    deadline: 2000
                })
        )
            .then(seo => {
                dispatch(setSeo(seo));
            })
            .catch(() => {
                dispatch(setSeo([]));
            });
    };
}
