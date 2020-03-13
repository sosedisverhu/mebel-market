import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllSubCategories from '../../../client/subCategory/queries/getAllSubCategories';
import deleteSubCategoriesByIdsQuery from '../../../client/subCategory/queries/deleteByIds';
import deleteProductsBySubCategory from '../../../client/product/queries/deleteProductsBySubCategory';

export default function deleteByIds (req, res) {
    const { ids } = req.body;
    Promise.all([
        deleteSubCategoriesByIdsQuery(ids),
        deleteProductsBySubCategory(ids)
    ])
        .then(() => {
            getAllSubCategories()
                .then(subCategories => {
                    res.status(OKEY_STATUS_CODE).send(subCategories);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
