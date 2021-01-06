import request from 'superagent';
import base from '../base';

import setReviews from '../../actions/setReviews';

export default function getReviews () {
    return dispatch => {
        return base(
            request
                .get('/api/client/review/all')
        )
            .then(reviews => {
                dispatch(setReviews(reviews));
            })
            .catch(() => {
                return dispatch(setReviews([]));
            });
    };
}
