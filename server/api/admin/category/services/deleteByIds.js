import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllCategories from '../../../client/category/queries/getAllCategories';
import deleteByIdsQuery from '../../../client/category/queries/deleteByIds';

export default function deleteByIds (req, res) {
    const { ids } = req.body;

    deleteByIdsQuery(ids)
        .then(() => {
            getAllCategories()
                .then(categories => {
                    res.status(OKEY_STATUS_CODE).send(categories);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
