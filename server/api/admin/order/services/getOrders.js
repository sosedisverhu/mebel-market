import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllOrders from '../../../client/order/queries/getAllOrders';

export default function getOrders (req, res) {
    getAllOrders()
        .then(orders => {
            const availableOrders = orders
                .sort((prev, next) => next.date - prev.date);

            res.status(OKEY_STATUS_CODE).send(availableOrders);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
