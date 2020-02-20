import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllReviews from '../queries/getAllReviews';

export default function getAvailableReviews (req, res) {
    getAllReviews()
        .then(reviews => {
            const availableReviews = reviews
                .filter(review => review.checked)
                .sort((prev, next) => next.date - prev.date);

            res.status(OKEY_STATUS_CODE).send(availableReviews);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
