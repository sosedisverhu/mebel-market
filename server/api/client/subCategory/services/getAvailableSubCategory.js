import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getSubCategoryById from '../queries/getSubCategoryById';
import editSubCategory from '../queries/editSubCategory';

import getSubCategoryValues from '../utils/getSubCategoryValues';

export default function getAvailableSubCategory (req, res) {
    const { id } = req.query;

    getSubCategoryById(id)
        .then(([subCategory]) => {
            if (!subCategory || subCategory.hidden) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            subCategory.views = (subCategory.views || 0) + 1;

            editSubCategory(subCategory)
                .then((subCategory) => {
                    res.status(OKEY_STATUS_CODE).send(...getSubCategoryValues(subCategory));
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
