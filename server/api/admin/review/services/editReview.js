import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareReview from '../utils/prepareReview';

import editReviewQuery from '../../../client/review/queries/editReview';

export default function editReview (req, res) {
    const review = prepareReview(req.body);

    editReviewQuery(review)
        .then(review => {
            res.status(OKEY_STATUS_CODE).send(review);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
