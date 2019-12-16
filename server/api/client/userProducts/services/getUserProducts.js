import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import uniqid from 'uniqid';

import append from '@tinkoff/utils/array/append';
import reduce from '@tinkoff/utils/array/reduce';
import find from '@tinkoff/utils/array/find';

import getUserProductsQuery from '../queries/getUserProducts';
import saveUserProduct from '../queries/saveUserProduct';
import getProductsByIds from '../../product/queries/getProductsByIds';

export default function getUserProducts (req, res) {
    const { id } = req.query;

    if (!id) {
        return saveUserProduct({
            basket: [],
            wishlist: [],
            id: uniqid()
        })
            .then((userProducts) => {
                res.status(OKEY_STATUS_CODE).send(userProducts);
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    }

    getUserProductsQuery(id)
        .then(([userProducts]) => {
            if (!userProducts) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            const { basket, wishlist, id } = userProducts;

            Promise.all([
                getProductsByIds(basket.map(basket => basket.id)),
                getProductsByIds(wishlist)
            ])
                .then(([basketProducts, wishlistProducts]) => {
                    return [
                        reduce((products, { id, quantity }) => {
                            const product = find(product => product.id === id, basketProducts);

                            return !product || product.hidden ? products : append({ product, quantity }, products);
                        }, [], basket),
                        reduce((products, id) => {
                            const product = find(product => product.id === id, wishlistProducts);

                            return !product || product.hidden ? products : append(product, products);
                        }, [], wishlist)
                    ];
                })
                .then(([basketProducts, wishlistProducts]) => {
                    res.status(OKEY_STATUS_CODE).send({
                        basket: basketProducts,
                        wishlist: wishlistProducts,
                        id
                    });
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
