import request from 'superagent';
import base from './base';

import setQuizzes from '../actions/setQuizzes';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getQuizzes () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/quiz/all')
                .query({ token })
        )
            .then(quizzes => {
                return dispatch(setQuizzes(quizzes));
            });
    };
}
