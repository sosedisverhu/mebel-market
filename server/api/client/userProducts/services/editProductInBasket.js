import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    COOKIE_YEARS, COOKIE_USER_PRODUCT_ID
} from '../../../../constants/constants';

import uniqid from 'uniqid';

import getUserProducts from '../queries/getUserProducts';
import saveUserProduct from '../queries/saveUserProduct';
import editUserProduct from '../queries/editUserProduct';
import getProductsByIds from '../../product/queries/getProductsByIds';

import reduce from '@tinkoff/utils/array/reduce';
import find from '@tinkoff/utils/array/find';
import append from '@tinkoff/utils/array/append';

export default function editProductInBasket (req, res) {
    const id = req.cookies[COOKIE_USER_PRODUCT_ID];
    const { productId, quantity, properties, basketItemId } = req.body;

    if (!id) {
        return saveUserProduct({
            basket: [{ productId, quantity, properties, id: uniqid() }],
            id: uniqid()
        })
            .then(result => {
                const { basket, id } = result;
                const expires = new Date();

                expires.setFullYear(expires.getFullYear() + COOKIE_YEARS);
                res.cookie(COOKIE_USER_PRODUCT_ID, id, { expires });

                getProductsByIds(basket.map(basket => basket.id))
                    .then(basketProducts => {
                        return [
                            reduce((products, { productId, quantity, properties, id }) => {
                                const product = find(product => product.id === productId, basketProducts);

                                if (!product || product.hidden) return products;

                                const size = product.sizes.ru.find(productSize => productSize.id === properties.size.id);

                                if (!size) return products;

                                const color = size.colors.find(color => color.id === properties.size.color.id);

                                if (!color) return products;

                                return append({ product, quantity, properties, id }, products);
                            }, [], basket)
                        ];
                    })
                    .then(basketProducts => {
                        res.status(OKEY_STATUS_CODE).send({
                            basket: basketProducts,
                            id
                        });
                    });
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    }

    getUserProducts(id)
        .then(([result]) => {
            if (!result) {
                return saveUserProduct({
                    basket: [{ productId, quantity, properties, id: uniqid() }],
                    id: uniqid()
                })
                    .then(result => {
                        const { basket, id } = result;
                        const expires = new Date();

                        expires.setFullYear(expires.getFullYear() + COOKIE_YEARS);
                        res.cookie(COOKIE_USER_PRODUCT_ID, id, { expires });

                        getProductsByIds(basket.map(basket => basket.productId))
                            .then((basketProducts) => {
                                return reduce((products, { productId, quantity, properties, id }) => {
                                    const product = find(product => product.id === productId, basketProducts);

                                    if (!product || product.hidden) return products;

                                    const size = product.sizes.ru.find(productSize => productSize.id === properties.size.id);

                                    if (!size) return products;

                                    const color = size.colors.find(color => color.id === properties.size.color.id);

                                    if (!color) return products;

                                    return append({ product, quantity, properties, id }, products);
                                }, [], basket);
                            })
                            .then((basketProducts) => {
                                res.status(OKEY_STATUS_CODE).send({
                                    basket: basketProducts,
                                    id
                                });
                            })
                            .catch(() => {
                                res.status(SERVER_ERROR_STATUS_CODE).end();
                            });
                    })
                    .catch(() => {
                        res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            }

            const { id, basket } = result;

            const newBasket = basket.map(basketItem => {
                if (basketItem.id === basketItemId) {
                    basketItem.quantity = quantity;
                    basketItem.properties = properties || basketItem.properties;
                }
                return basketItem;
            });

            return editUserProduct({
                basket: newBasket,
                id
            })
                .then(result => {
                    const { basket, id } = result;

                    getProductsByIds(basket.map(basket => basket.productId))
                        .then((basketProducts) => {
                            return reduce((products, { productId, quantity, properties, id }) => {
                                const product = find(product => product.id === productId, basketProducts);

                                if (!product || product.hidden) return products;

                                const size = product.sizes.ru.find(productSize => productSize.id === properties.size.id);

                                if (!size) return products;

                                const color = size.colors.find(color => color.id === properties.size.color.id);

                                if (!color) return products;

                                return append({ product, quantity, properties, id }, products);
                            }, [], basket);
                        })
                        .then((basketProducts) => {
                            res.status(OKEY_STATUS_CODE).send({
                                basket: basketProducts,
                                id
                            });
                        })
                        .catch(() => {
                            res.status(SERVER_ERROR_STATUS_CODE).end();
                        });
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
