import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllCategories from '../../../client/category/queries/getAllCategories';
import deleteCategoriesByIdsQuery from '../../../client/category/queries/deleteByIds';
import deleteSubCategoriesByCategoryQuery from '../../../client/subCategory/queries/deleteSubCategoriesByCategory';
import deleteProductsByCategoryQuery from '../../../client/product/queries/deleteProductsByCategory';

export default function deleteByIds (req, res) {
    const { ids } = req.body;

    Promise.all([
        deleteCategoriesByIdsQuery(ids),
        deleteSubCategoriesByCategoryQuery(ids),
        deleteProductsByCategoryQuery(ids)
    ])
        .then(() => {
            getAllCategories()
                .then(categories => {
                    res.status(OKEY_STATUS_CODE).send(categories);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
