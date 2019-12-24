import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareQuiz from '../utils/prepareQuiz';

import editQuizQuery from '../../../client/quiz/queries/editQuiz';

export default function editQuiz (req, res) {
    const quiz = prepareQuiz(req.body);

    editQuizQuery(quiz)
        .then(quiz => {
            res.status(OKEY_STATUS_CODE).send(quiz);
        })
        .catch((err) => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
