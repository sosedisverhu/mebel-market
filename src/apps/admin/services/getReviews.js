import request from 'superagent';
import base from './base';

import setReviews from '../actions/setReviews';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getReviews () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/review/all')
                .query({ token })
        )
            .then(reviews => {
                return dispatch(setReviews(reviews));
            });
    };
}
