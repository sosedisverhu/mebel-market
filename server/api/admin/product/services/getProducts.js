import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllProducts from '../../../client/product/queries/getAllProducts';

export default function getProducts (req, res) {
    getAllProducts()
        .then(products => {
            res.status(OKEY_STATUS_CODE).send(products.sort((prev, next) => prev.positionIndex - next.positionIndex));
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
