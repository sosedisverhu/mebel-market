import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllSubCategories from '../../../client/subCategory/queries/getAllSubCategories';

export default function getSubCategories (req, res) {
    getAllSubCategories()
        .then(subCategories => {
            const sortableSubCategories = subCategories
                .sort((oldSubCategory, newSubCategory) => oldSubCategory.positionIndex - newSubCategory.positionIndex);

            res.status(OKEY_STATUS_CODE).send(sortableSubCategories);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
