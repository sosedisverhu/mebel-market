import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllSubCategories from '../../../client/subCategory/queries/getAllSubCategories';

export default function getSubCategories (req, res) {
    getAllSubCategories()
        .then(subCategories => {
            res.status(OKEY_STATUS_CODE).send(subCategories);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
