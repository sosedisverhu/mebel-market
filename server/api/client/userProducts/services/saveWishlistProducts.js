import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import uniqid from 'uniqid';

import getUserProductsQuery from '../queries/getUserProducts';
import saveUserProduct from '../queries/saveUserProduct';
import editUserProduct from '../queries/editUserProduct';

export default function saveWishlistProducts (req, res) {
    const { id } = req.query;
    const wishlist = req.body;

    if (!id) {
        return saveUserProduct({
            wishlist,
            basket: [],
            id: uniqid()
        })
            .then((savedProducts) => {
                res.status(OKEY_STATUS_CODE).send(savedProducts.id);
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    }

    getUserProductsQuery(id)
        .then(([savedProducts]) => {
            if (!savedProducts) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            const { basket, id } = savedProducts;

            editUserProduct({
                wishlist,
                basket,
                id
            })
                .then((savedProducts) => {
                    res.status(OKEY_STATUS_CODE).send(savedProducts.id);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
