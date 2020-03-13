import request from 'superagent';
import base from '../base';

import setReviews from '../../actions/setReviews';

export default function getReviews (req) {
    return dispatch => {
        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/client/review/all`)
                .timeout({
                    deadline: 2000
                })
        )
            .then(reviews => {
                dispatch(setReviews(reviews));
            })
            .catch(() => {
                return dispatch(setReviews([]));
            });
    };
}
