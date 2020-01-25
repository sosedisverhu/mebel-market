import uniqid from 'uniqid';

import {
    MONGODB_DUPLICATE_CODE,
    NOT_FOUND_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';

import prepareQuiz from '../utils/prepareQuiz';

import saveQuizQuery from '../../../client/quiz/queries/saveQuiz';

export default function saveQuiz (req, res) {
    const quiz = prepareQuiz(req.body);
    const id = uniqid();

    saveQuizQuery({ ...quiz, id })
        .then(quiz => {
            res.status(OKEY_STATUS_CODE).send(quiz);
        })
        .catch((err) => {
            if (err.code === MONGODB_DUPLICATE_CODE) {
                return res.status(NOT_FOUND_STATUS_CODE).send({ code: 'duplication' });
            }
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
