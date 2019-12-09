import uniqid from 'uniqid';

import {
    MONGODB_DUPLICATE_CODE,
    NOT_FOUND_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';

import preparePartner from '../utils/preparePartner';

import savePartnerQuery from '../../../client/partner/queries/savePartner';

export default function savePartner (req, res) {
    const partner = preparePartner(req.body);
    const id = uniqid();

    savePartnerQuery({ ...partner, id })
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
