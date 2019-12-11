import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllProducts from '../queries/getAllProducts';

export default function getAvailableProducts (req, res) {
    getAllProducts()
        .then(products => {
            const availableProducts = products
                .filter(product => !product.hidden)
                .map((product) => {
                    product.price = product.discount ? Math.round(product.basePrice - (product.basePrice / 100 * product.discount)) : product.basePrice;
                    return product;
                })
                .sort((prev, next) => next.date - prev.date);

            res.status(OKEY_STATUS_CODE).send(availableProducts);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
