import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getPartnerById from '../queries/getPartnerById';
import editPartner from '../queries/editPartner';

import getPartnerValues from '../utils/getPartnerValues';

export default function getAvailablePartner (req, res) {
    const { id } = req.query;

    getPartnerById(id)
        .then(([partner]) => {
            if (!partner || partner.hidden) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            partner.views = (partner.views || 0) + 1;

            editPartner(partner)
                .then((partner) => {
                    res.status(OKEY_STATUS_CODE).send(...getPartnerValues(partner));
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
