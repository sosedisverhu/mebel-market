import request from 'superagent';
import base from './base';

import setReviewsAction from '../actions/setReviews';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function deleteReview (ids) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .post('/api/admin/review/delete-few')
                .send({ ids })
                .query({ token })
        )
            .then(reviews => {
                return dispatch(setReviewsAction(reviews));
            });
    };
}
