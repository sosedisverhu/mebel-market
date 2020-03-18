import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllProducts from '../queries/getAllProducts';

export default function getAvailableProducts (req, res) {
    getAllProducts()
        .then(products => {
            const availableProducts = products
                .filter(product => !product.hidden)
                .sort((prev, next) => prev.positionIndex - next.positionIndex);

            res.status(OKEY_STATUS_CODE).send(availableProducts);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
