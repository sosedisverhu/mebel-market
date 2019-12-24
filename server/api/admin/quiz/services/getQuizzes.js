import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllQuizzes from '../../../client/quiz/queries/getAllQuizzes';

export default function getQuizzes (req, res) {
    getAllQuizzes()
        .then(quizzes => {
            res.status(OKEY_STATUS_CODE).send(quizzes);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
