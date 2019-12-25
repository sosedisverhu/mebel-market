import uniqid from 'uniqid';
import saveReviewQuery from '../queries/saveReview';
import prepareReview from '../../../admin/review/utils/prepareReview';

import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';

export default function saveOrder (req, res) {
    const review = prepareReview(req.body);
    const id = uniqid();
    const date = Date.now();
    const checked = false;

    saveReviewQuery({ ...review, id, date, checked })
        .then(review => {
            res.status(OKEY_STATUS_CODE).send(review);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
