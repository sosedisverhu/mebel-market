import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE, MONGODB_DUPLICATE_CODE } from '../../../../constants/constants';

import preparePartner from '../utils/preparePartner';

import editPartnerQuery from '../../../client/partner/queries/editPartner';

export default function editPartner (req, res) {
    const partner = preparePartner(req.body);

    editPartnerQuery(partner)
        .then(partner => {
            res.status(OKEY_STATUS_CODE).send(partner);
        })
        .catch((err) => {
            if (err.code === MONGODB_DUPLICATE_CODE) {
                return res.status(NOT_FOUND_STATUS_CODE).send({ code: 'duplication' });
            }

            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
