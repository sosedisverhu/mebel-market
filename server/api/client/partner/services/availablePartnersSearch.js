import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import findPartnerByName from '../queries/findPartnersByName';

export default function availablePartnersSearch (req, res) {
    const { text } = req.query;

    findPartnerByName(text)
        .then(partners => {
            const availablePartners = partners
                .filter(partner => !partner.hidden);

            res.status(OKEY_STATUS_CODE).send(availablePartners);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
