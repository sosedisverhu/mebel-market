import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllReviews from '../../../client/review/queries/getAllReviews';
import deleteByIdsQuery from '../../../client/review/queries/deleteByIds';

export default function deleteByIds (req, res) {
    const { ids } = req.body;

    deleteByIdsQuery(ids)
        .then(() => {
            getAllReviews()
                .then(reviews => {
                    res.status(OKEY_STATUS_CODE).send(reviews);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
