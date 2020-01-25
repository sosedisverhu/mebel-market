import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import findQuizzesByNameQuery from '../../../client/quiz/queries/findQuizzesByName';

export default function findQuizzesByName (req, res) {
    const { text } = req.query;

    findQuizzesByNameQuery(text)
        .then(quizzes => {
            res.status(OKEY_STATUS_CODE).send(quizzes);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
