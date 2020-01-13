import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllQuizzes from '../../../client/quiz/queries/getAllQuizzes';
import deleteByIdsQuery from '../../../client/quiz/queries/deleteByIds';

export default function deleteByIds (req, res) {
    const { ids } = req.body;

    deleteByIdsQuery(ids)
        .then(() => {
            getAllQuizzes()
                .then(quizzes => {
                    res.status(OKEY_STATUS_CODE).send(quizzes);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
