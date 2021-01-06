import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    COOKIE_YEARS, COOKIE_USER_PRODUCT_ID
} from '../../../../constants/constants';

import uniqid from 'uniqid';

import getUserProductsQuery from '../queries/getUserProducts';
import saveUserProduct from '../queries/saveUserProduct';
import editUserProduct from '../queries/editUserProduct';
import getProductsByIds from '../../product/queries/getProductsByIds';

import reduce from '@tinkoff/utils/array/reduce';
import find from '@tinkoff/utils/array/find';
import append from '@tinkoff/utils/array/append';

export default function saveWishlistProducts (req, res) {
    const id = req.cookies[COOKIE_USER_PRODUCT_ID];
    const { productId, properties } = req.body;

    if (!id) {
        return saveUserProduct({
            wishlist: [{ productId, properties, id: uniqid() }],
            id: uniqid()
        })
            .then((result) => {
                const { wishlist, id } = result;
                const expires = new Date();

                expires.setFullYear(expires.getFullYear() + COOKIE_YEARS);
                res.cookie(COOKIE_USER_PRODUCT_ID, id, { expires });

                getProductsByIds(wishlist.map(wishlist => wishlist.id))
                    .then((wishlistProducts) => {
                        return [
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
                    .then((wishlistProducts) => {
                        res.status(OKEY_STATUS_CODE).send({
                            wishlist: wishlistProducts,
                            id
                        });
                    });
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    }

    getUserProductsQuery(id)
        .then(([result]) => {
            if (!result) {
                return saveUserProduct({
                    wishlist: [{ productId, properties, id: uniqid() }],
                    id: uniqid()
                })
                    .then((result) => {
                        const { wishlist, id } = result;
                        const expires = new Date();

                        expires.setFullYear(expires.getFullYear() + COOKIE_YEARS);
                        res.cookie(COOKIE_USER_PRODUCT_ID, id, { expires });

                        getProductsByIds(wishlist.map(wishlist => wishlist.productId))
                            .then((wishlistProducts) => {
                                return reduce((products, { productId, properties, id }) => {
                                    const product = find(product => product.id === productId, wishlistProducts);

                                    if (!product || product.hidden) return products;

                                    const size = product.sizes.ru.find(productSize => productSize.id === properties.size.id);

                                    if (!size) return products;

                                    const color = size.colors.find(color => color.id === properties.size.color.id);

                                    if (!color) return products;

                                    return append({ product, properties, id }, products);
                                }, [], wishlist);
                            })
                            .then((wishlistProducts) => {
                                res.status(OKEY_STATUS_CODE).send({
                                    wishlist: wishlistProducts,
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

            const { id, wishlist } = result;
            const wishlistRepeatIndexes = wishlist.reduce((result, wishlist, i) => {
                if (wishlist.productId === productId) {
                    return [
                        ...result,
                        i
                    ];
                }

                return result;
            }, []);
            const newWishlist = wishlistRepeatIndexes.reduce((newWishlist, wishlistIndex) => {
                const wishlistNotUniq = wishlist[wishlistIndex];

                if (wishlistNotUniq.productId === productId && wishlistNotUniq.properties === properties) {
                    return [...wishlist];
                }

                return newWishlist;
            }, [...wishlist, { productId, properties, id: uniqid() }]) || [...wishlist, { productId, properties, id: uniqid() }];

            return editUserProduct({
                wishlist: newWishlist,
                id
            })
                .then((result) => {
                    const { wishlist, id } = result;

                    getProductsByIds(wishlist.map(wishlist => wishlist.productId))
                        .then((wishlistProducts) => {
                            return reduce((products, { productId, properties, id }) => {
                                const product = find(product => product.id === productId, wishlistProducts);

                                if (!product || product.hidden) return products;

                                const size = product.sizes.ru.find(productSize => productSize.id === properties.size.id);

                                if (!size) return products;

                                const color = size.colors.find(color => color.id === properties.size.color.id);

                                if (!color) return products;

                                return append({ product, properties, id }, products);
                            }, [], wishlist);
                        })
                        .then((wishlistProducts) => {
                            res.status(OKEY_STATUS_CODE).send({
                                wishlist: wishlistProducts,
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
