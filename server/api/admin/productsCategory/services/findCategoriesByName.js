import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import findCategoriesByNameQuery from '../../../client/productsCategory/queries/findCategoriesByName';

export default function findCategoriesByName (req, res) {
    const { text } = req.query;

    findCategoriesByNameQuery(text)
        .then(categories => {
            res.status(OKEY_STATUS_CODE).send(categories);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
