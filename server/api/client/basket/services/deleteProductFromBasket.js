import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    COOKIE_BASKET_ID
} from '../../../../constants/constants';

import uniqid from 'uniqid';

import getBasketProducts from '../queries/getBasket';
import saveBasketProduct from '../queries/saveBasket';
import editBasketProduct from '../queries/editBasket';
import getProductsByIds from '../../product/queries/getProductsByIds';

import reduce from '@tinkoff/utils/array/reduce';
import find from '@tinkoff/utils/array/find';
import findIndex from '@tinkoff/utils/array/findIndex';
import append from '@tinkoff/utils/array/append';
import remove from '@tinkoff/utils/array/remove';

export default function deleteProductFromBasket (req, res) {
    const id = req.cookies[COOKIE_BASKET_ID];
    const { basketItemId } = req.query;

    if (!id) {
        return saveBasketProduct({
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

    getBasketProducts(id)
        .then(([result]) => {
            if (!result) {
                return saveBasketProduct({
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

            return editBasketProduct({
                basket: newBasket,
                id
            })
                .then((result) => {
                    const { basket, id } = result;

                    getProductsByIds(basket.map(basket => basket.productId))
                        .then((baskedProducts) => {
                            return reduce((products, { productId, quantity, properties, id }) => {
                                const product = find(product => product.id === productId, baskedProducts);

                                return !product || product.hidden ? products : append({ product, quantity, properties, id }, products);
                            }, [], basket);
                        })
                        .then((baskedProducts) => {
                            res.status(OKEY_STATUS_CODE).send({
                                basket: baskedProducts,
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
