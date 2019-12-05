import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareProduct from '../utils/prepareProduct';

import saveProductQuery from '../../../client/product/queries/saveProduct';

export default function saveProduct (req, res) {
    const product = prepareProduct(req.body);
    const id = uniqid();
    const date = Date.now();

    saveProductQuery({ ...product, date, id })
        .then(product => {
            res.status(OKEY_STATUS_CODE).send(product);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
