import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllQuizzes from '../queries/getAllQuizzes';

export default function getAvailableQuizzes (req, res) {
    getAllQuizzes()
        .then(quizzes => {
            const availableQuizzes = quizzes
                .filter(quiz => !quiz.hidden);

            res.status(OKEY_STATUS_CODE).send(availableQuizzes);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
