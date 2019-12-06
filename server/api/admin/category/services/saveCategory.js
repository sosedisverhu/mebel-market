import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareCategory from '../utils/prepareCategory';

import saveCategoryQuery from '../../../client/category/queries/saveCategory';

export default function saveCategory (req, res) {
    const category = prepareCategory(req.body);
    const id = uniqid();

    saveCategoryQuery({ ...category, id })
        .then(category => {
            res.status(OKEY_STATUS_CODE).send(category);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
