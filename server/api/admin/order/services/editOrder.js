import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareOrder from '../utils/prepareOrder';

import editOrderQuery from '../../../client/order/queries/editOrder';

export default function editOrder (req, res) {
    const order = prepareOrder(req.body);

    editOrderQuery(order)
        .then(order => {
            res.status(OKEY_STATUS_CODE).send(order);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
