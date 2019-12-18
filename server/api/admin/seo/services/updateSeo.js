import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareSeo from '../utils/prepareSeo';

import saveSeo from '../../../client/seo/queries/saveSeo';
import getSeoByName from '../../../client/seo/queries/getSeoByName';
import editSeo from '../../../client/seo/queries/editSeo';

export default function updateSeo (req, res) {
    const newSeo = prepareSeo(req.body);

    getSeoByName(newSeo.name)
        .then(([seo]) => {
            (seo ? editSeo(newSeo) : saveSeo(newSeo))
                .then(updatedSeo => {
                    res.status(OKEY_STATUS_CODE).send(updatedSeo);
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
