import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import findProductsByName from '../queries/findProductsByName';

export default function availableProductsSearch (req, res) {
    const { text } = req.query;

    findProductsByName(text)
        .then(products => {
            const availableProducts = products
                .filter(product => !product.hidden)
                .map((product) => {
                    product.price = product.discount ? Math.round(product.price - (product.price / 100 * product.discount)) : product.price;

                    return product;
                })
                .sort((prev, next) => next.date - prev.date);

            res.status(OKEY_STATUS_CODE).send(availableProducts);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
