import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import uniqid from 'uniqid';

import reduce from '@tinkoff/utils/array/reduce';
import find from '@tinkoff/utils/array/find';

import getUserProductsQuery from '../queries/getUserProducts';
import saveUserProduct from '../queries/saveUserProduct';
import editUserProduct from '../queries/editUserProduct';
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
        .then(([result]) => {
            if (!result) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            const { wishlist, id } = result[0];

            getProductsByIds(wishlist.map(wishlist => wishlist.productId))
                .then((wishlistProducts) => {
                    return reduce(({ products, remainingWishlist }, wishlist) => {
                        const { productId, id } = wishlist;
                        const product = find(product => product.id === productId, wishlistProducts);

                        return !product ||
                            product.hidden
                            ? { products, remainingWishlist }
                            : {
                                products: [...products, { product, id }],
                                remainingWishlist: [...remainingWishlist, wishlist]
                            };
                    }, { products: [], remainingWishlist: [] }, wishlist);
                })
                .then(({ products, remainingWishlist }) => {
                    return editUserProduct({
                        wishlist: remainingWishlist,
                        id: id
                    })
                        .then(() => {
                            res.status(OKEY_STATUS_CODE).send({
                                wishlist: products,
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
