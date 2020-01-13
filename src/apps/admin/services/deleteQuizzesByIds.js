import request from 'superagent';
import base from './base';

import setQuizzes from '../actions/setQuizzes';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function deleteQuizzes (ids) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .post('/api/admin/quiz/delete-few')
                .send({ ids })
                .query({ token })
        )
            .then(quizzes => {
                return dispatch(setQuizzes(quizzes));
            });
    };
}
