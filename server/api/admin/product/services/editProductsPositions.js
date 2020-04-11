import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import editProductQuery from '../../../client/product/queries/editProduct';

export default function editPositions (req, res) {
    try {
        const { type } = req.query;

        Promise.all([
            (req.body || []).map((id, i) => {
                return editProductQuery({ id, ...(type === 'category' ? { positionIndexInCategory: i } : { positionIndexInSubCategory: i }) })
                    .then(product => product);
            })
        ])
            .then(() => {
                res.status(OKEY_STATUS_CODE).send();
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
