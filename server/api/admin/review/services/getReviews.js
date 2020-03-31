import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllReviews from '../../../client/review/queries/getAllReviews';

export default function getReviews (req, res) {
    try {
        getAllReviews()
            .then(reviews => {
                const availableReviews = reviews
                    .sort((prev, next) => next.date - prev.date);

                res.status(OKEY_STATUS_CODE).send(availableReviews);
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
