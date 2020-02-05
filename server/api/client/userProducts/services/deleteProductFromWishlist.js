import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    COOKIE_USER_PRODUCT_ID
} from '../../../../constants/constants';

import uniqid from 'uniqid';

import getUserProducts from '../queries/getUserProducts';
import saveUserProduct from '../queries/saveUserProduct';
import editUserProduct from '../queries/editUserProduct';
import getProductsByIds from '../../product/queries/getProductsByIds';

import reduce from '@tinkoff/utils/array/reduce';
import find from '@tinkoff/utils/array/find';
import findIndex from '@tinkoff/utils/array/findIndex';
import append from '@tinkoff/utils/array/append';
import remove from '@tinkoff/utils/array/remove';

export default function deleteProductFromWishlist (req, res) {
    const id = req.cookies[COOKIE_USER_PRODUCT_ID];
    const { wishlistItemId } = req.query;

    if (!id) {
        return saveUserProduct({
            wishlist: [],
            id: uniqid()
        })
            .then((result) => {
                res.status(OKEY_STATUS_CODE).send(result);
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    }

    getUserProducts(id)
        .then(([result]) => {
            if (!result) {
                return saveUserProduct({
                    wishlist: [],
                    id: uniqid()
                })
                    .then((result) => {
                        res.status(OKEY_STATUS_CODE).send(result);
                    })
                    .catch(() => {
                        res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            }

            const { id, wishlist } = result;
            const wishlistItemForDeleteIndex = findIndex(wishlistItem => wishlistItem.id === wishlistItemId, wishlist);
            const newWishlist = wishlistItemForDeleteIndex !== -1 ? remove(wishlistItemForDeleteIndex, 1, wishlist) : wishlist;

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
