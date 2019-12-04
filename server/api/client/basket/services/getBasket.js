import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import uniqid from 'uniqid';

import reduce from '@tinkoff/utils/array/reduce';
import find from '@tinkoff/utils/array/find';

import getBasketProducts from '../queries/getBasket';
import editBasket from '../queries/editBasket';
import getProductsByIds from '../../product/queries/getProductsByIds';
import saveBasketProduct from '../queries/saveBasket';

export default function getBasket (req, res) {
    const { id } = req.query;
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
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            const { basket, id } = result[0];

            getProductsByIds(basket.map(basket => basket.productId))
                .then((baskedProducts) => {
                    return reduce(({ products, remainingBasket }, basket) => {
                        const { productId, quantity, properties, id } = basket;
                        const product = find(product => product.id === productId, baskedProducts);

                        return !product ||
                        product.hidden ||
                        properties.size !== !find(size => properties.size === size.id, product.sizes)
                            ? { products, remainingBasket }
                            : {
                                products: [...products, { product, quantity, properties, id }],
                                remainingBasket: [...remainingBasket, basket]
                            };
                    }, { products: [], remainingBasket: [] }, basket);
                })
                .then(({ products, remainingBasket }) => {
                    return editBasket({
                        basket: remainingBasket,
                        id: id
                    })
                        .then(() => {
                            res.status(OKEY_STATUS_CODE).send({
                                basket: products,
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
