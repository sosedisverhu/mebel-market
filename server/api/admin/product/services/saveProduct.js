import uniqid from 'uniqid';

import {
    MONGODB_DUPLICATE_CODE,
    NOT_FOUND_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';

import prepareProduct from '../utils/prepareProduct';

import saveProductQuery from '../../../client/product/queries/saveProduct';

export default function saveProduct (req, res) {
    const product = prepareProduct(req.body);
    const id = uniqid();
    const date = Date.now();
    const views = 0;

    saveProductQuery({ ...product, date, id, views })
        .then(product => {
            res.status(OKEY_STATUS_CODE).send(product);
        })
        .catch(err => {
            if (err.code === MONGODB_DUPLICATE_CODE) {
                return res.status(NOT_FOUND_STATUS_CODE).send({ code: 'duplication' });
            }

            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
