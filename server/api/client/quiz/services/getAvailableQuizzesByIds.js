import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getQuizzesByIds from '../queries/getQuizzesByIds';

export default function getAvailableQuizzesByIds (req, res) {
    const ids = req.body;

    getQuizzesByIds(ids)
        .then(quiz => {
            const availableQuizzes = quiz
                .filter(quiz => !quiz.hidden);

            res.status(OKEY_STATUS_CODE).send(availableQuizzes);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
