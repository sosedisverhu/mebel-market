import uniqid from 'uniqid';

import {
    MONGODB_DUPLICATE_CODE,
    NOT_FOUND_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';

import prepareSubCategory from '../utils/prepareSubCategory';

import saveSubCategoryQuery from '../../../client/subCategory/queries/saveSubCategory';

export default function saveSubCategory (req, res) {
    const subCategory = prepareSubCategory(req.body);
    const id = uniqid();
    const date = Date.now();

    saveSubCategoryQuery({ ...subCategory, date, id })
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
