import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    NOT_FOUND_STATUS_CODE,
    MONGODB_DUPLICATE_CODE
} from '../../../../constants/constants';

import prepareSubCategory from '../utils/prepareSubCategory';

import editSubCategoryQuery from '../../../client/subCategory/queries/editSubCategory';

export default function editSubCategory (req, res) {
    const subCategory = prepareSubCategory(req.body);

    editSubCategoryQuery(subCategory)
        .then(subCategory => {
            res.status(OKEY_STATUS_CODE).send(subCategory);
        })
        .catch((err) => {
            if (err.code === MONGODB_DUPLICATE_CODE) {
                return res.status(NOT_FOUND_STATUS_CODE).send({ code: 'duplication' });
            }
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
