import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import editPartnerQuery from '../../../client/partner/queries/editPartner';

export default function editPositions (req, res) {
    try {
        Promise.all([
            (req.body || []).map((id, i) => {
                editPartnerQuery({ id, positionIndex: i })
                    .then(partner => {
                        res.status(OKEY_STATUS_CODE).send(partner);
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
