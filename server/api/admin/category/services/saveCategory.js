import uniqid from 'uniqid';

import {
    MONGODB_DUPLICATE_CODE,
    NOT_FOUND_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';

import prepareCategory from '../utils/prepareCategory';

import saveCategoryQuery from '../../../client/category/queries/saveCategory';

export default function saveCategory (req, res) {
    const category = prepareCategory(req.body);
    const id = uniqid();

    saveCategoryQuery({ ...category, id })
        .then(category => {
            res.status(OKEY_STATUS_CODE).send(category);
        })
        .catch((err) => {
            if (err.code === MONGODB_DUPLICATE_CODE) {
                return res.status(NOT_FOUND_STATUS_CODE).send({ code: 'duplication' });
            }

            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
