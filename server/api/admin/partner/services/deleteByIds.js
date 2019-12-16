import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllPartners from '../../../client/partner/queries/getAllPartners';
import deleteByIdsQuery from '../../../client/partner/queries/deleteByIds';

export default function deleteByIds (req, res) {
    const { ids } = req.body;

    deleteByIdsQuery(ids)
        .then(() => {
            getAllPartners()
                .then(partners => {
                    res.status(OKEY_STATUS_CODE).send(partners);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
