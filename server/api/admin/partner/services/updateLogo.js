import fs from 'fs';
import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE, PARTNERS_ITEM_LOGO_FIELD_NAME_REGEX } from '../../../../constants/constants';

import editPartnerQuery from '../../../client/partner/queries/editPartner';
import getPartnerById from '../../../client/partner/queries/getPartnerById';

import multipart from '../../../../helpers/multipart';

import noop from '@tinkoff/utils/function/noop';

const uploader = multipart(PARTNERS_ITEM_LOGO_FIELD_NAME_REGEX);

export default function updateLogo (req, res) {
    const { id } = req.query;

    getPartnerById(id)
        .then(([partner]) => {
            uploader(req, res, (err) => {
                if (err) {
                    return res.status(SERVER_ERROR_STATUS_CODE).end();
                }

                partner.logo && fs.unlink(partner.logo.slice(1), noop);

                const files = req.files;
                const logo = `/${files[0].path.replace(/\\/g, '/')}`;

                editPartnerQuery({ logo, id })
                    .then(partner => {
                        res.status(OKEY_STATUS_CODE).send(partner);
                    })
                    .catch(() => {
                        fs.unlink(logo.slice(1), noop);

                        return res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            });
        })
        .catch(() => {
            return res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
