import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getPartnersByIds from '../queries/getPartnersByIds';

export default function getAvailablePartnersByIds (req, res) {
    const ids = req.body;

    getPartnersByIds(ids)
        .then(partners => {
            const availablePartners = partners
                .filter(partner => !partner.hidden);

            res.status(OKEY_STATUS_CODE).send(availablePartners);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
