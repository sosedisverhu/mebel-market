import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    NOT_FOUND_STATUS_CODE,
    MONGODB_DUPLICATE_CODE
} from '../../../../constants/constants';

import prepareProduct from '../utils/prepareProduct';

import editProductQuery from '../../../client/product/queries/editProduct';

export default function editProduct (req, res) {
    const product = prepareProduct(req.body);

    editProductQuery(product)
        .then(product => {
            res.status(OKEY_STATUS_CODE).send(product);
        })
        .catch((err) => {
            if (err.code === MONGODB_DUPLICATE_CODE) {
                return res.status(NOT_FOUND_STATUS_CODE).send({ code: 'duplication' });
            }
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
