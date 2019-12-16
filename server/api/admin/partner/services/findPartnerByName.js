import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import findPartnersByNameQuery from '../../../client/partner/queries/findPartnersByName';

export default function findPartnersByName (req, res) {
    const { text } = req.query;

    findPartnersByNameQuery(text)
        .then(partners => {
            res.status(OKEY_STATUS_CODE).send(partners);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
