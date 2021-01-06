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

export default function deleteProductFromBasket (req, res) {
    const id = req.cookies[COOKIE_USER_PRODUCT_ID];
    const { basketItemId } = req.query;

    if (!id) {
        return saveUserProduct({
            basket: [],
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
                    basket: [],
                    id: uniqid()
                })
                    .then((result) => {
                        res.status(OKEY_STATUS_CODE).send(result);
                    })
                    .catch(() => {
                        res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            }

            const { id, basket } = result;
            const basketItemForDeleteIndex = findIndex(basketItem => basketItem.id === basketItemId, basket);
            const newBasket = basketItemForDeleteIndex !== -1 ? remove(basketItemForDeleteIndex, 1, basket) : basket;

            return editUserProduct({
                basket: newBasket,
                id
            })
                .then((result) => {
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
