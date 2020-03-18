import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import editProductQuery from '../../../client/product/queries/editProduct';

export default function editPositions (req, res) {
    try {
        Promise.all([
            (req.body || []).map((id, i) => {
                editProductQuery({ id, positionIndex: i })
                    .then(product => {
                        res.status(OKEY_STATUS_CODE).send(product);
                    })
                    .catch(() => {
                        res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            })
        ])
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
