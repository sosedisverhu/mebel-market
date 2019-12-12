import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import preparePartner from '../utils/preparePartner';

import editPartnerQuery from '../../../client/partner/queries/editPartner';

export default function editPartner (req, res) {
    const partner = preparePartner(req.body);

    editPartnerQuery(partner)
        .then(partner => {
            res.status(OKEY_STATUS_CODE).send(partner);
        })
        .catch((err) => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
