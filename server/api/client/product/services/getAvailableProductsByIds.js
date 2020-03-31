import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getProductsByIds from '../queries/getProductsByIds';

export default function getAvailableProductsByIds (req, res) {
    const ids = req.body;

    getProductsByIds(ids)
        .then(products => {
            const availableProducts = products
                .filter(product => !product.hidden)
                .sort((prev, next) => next.date - prev.date);

            res.status(OKEY_STATUS_CODE).send(availableProducts);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
