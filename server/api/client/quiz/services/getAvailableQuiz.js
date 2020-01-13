import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getQuizById from '../queries/getQuizById';
import editQuiz from '../queries/editQuiz';

import getQuizValues from '../utils/getQuizValues';

export default function getAvailableQuiz (req, res) {
    const { id } = req.query;

    getQuizById(id)
        .then(([quiz]) => {
            if (!quiz || quiz.hidden) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            quiz.views = (quiz.views || 0) + 1;

            editQuiz(quiz)
                .then((quiz) => {
                    res.status(OKEY_STATUS_CODE).send(...getQuizValues(quiz));
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
