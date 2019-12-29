import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllSeoQuery from '../queries/getAllSeo';

export default function getAllSeo (req, res) {
    getAllSeoQuery()
        .then((seo) => {
            res.status(OKEY_STATUS_CODE).send(seo);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
