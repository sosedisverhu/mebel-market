import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    NOT_FOUND_STATUS_CODE
} from '../../../../constants/constants';

import getProductById from '../queries/getProductById';
import editProduct from '../queries/editProduct';

export default function addProductViews (req, res) {
    const { id } = req.query;

    getProductById(id)
        .then(([product]) => {
            if (!product || product.hidden) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            return editProduct({ id: product.id, views: product.views + 1 })
                .then(() => {
                    res.status(OKEY_STATUS_CODE).end();
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
