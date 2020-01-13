import request from 'superagent';
import base from '../base';

import setQuizzes from '../../actions/setQuizzes';

export default function getQuizzes (req) {
    return dispatch => {
        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/client/quiz/all`)
                .timeout({
                    deadline: 2000
                })
        )
            .then(quizzes => {
                dispatch(setQuizzes(quizzes));
            })
            .catch(() => {
                return dispatch(setQuizzes([]));
            });
    };
}
