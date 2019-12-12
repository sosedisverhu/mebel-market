import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import findSubCategoriesByNameQuery from '../../../client/subCategory/queries/findSubCategoriesByName';

export default function findSubCategoriesByName (req, res) {
    const { text } = req.query;

    findSubCategoriesByNameQuery(text)
        .then(subCategories => {
            res.status(OKEY_STATUS_CODE).send(subCategories);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
