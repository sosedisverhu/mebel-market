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
    Promise.all([
        getUserProductsQuery(id)
    ])
        .then(([userProducts]) => {
            if (!userProducts) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            const { basket, wishlist, id } = userProducts[0];
            // console.log('3) wishlist', wishlist);

            Promise.all([
                getProductsByIds(basket.map(basket => basket.productId)),
                getProductsByIds(wishlist.map(wishlist => wishlist.productId))
            ])
                .then(([basketProducts, wishlistProducts]) => {
                    return [
                        reduce((products, { productId, quantity, properties, id }) => {
                            const product = find(product => product.id === productId, basketProducts);

                            if (!product || product.hidden) return products;

                            const size = product.sizes.ru.find(productSize => productSize.id === properties.size.id);

                            if (!size) return products;

                            const color = size.colors.find(color => color.id === properties.size.color.id);

                            if (!color) return products;

                            return append({ product, quantity, properties, id }, products);
                        }, [], basket),
                        reduce((products, { productId, properties, id }) => {
                            const product = find(product => product.id === productId, wishlistProducts);

                            if (!product || product.hidden) return products;

                            const size = product.sizes.ru.find(productSize => productSize.id === properties.size.id);

                            if (!size) return products;

                            const color = size.colors.find(color => color.id === properties.size.color.id);

                            if (!color) return products;

                            return append({ product, properties, id }, products);
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
