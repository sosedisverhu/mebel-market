import {
    MONGODB_DUPLICATE_CODE,
    NOT_FOUND_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';

import prepareCategory from '../utils/prepareCategory';
import getCategory from '../../../client/category/queries/getCategoryById';

import editCategoryQuery from '../../../client/category/queries/editCategory';
import toggleHiddenNewsByCategory from '../../../client/product/queries/toggleHiddenProductsByCategory';

export default function editCategory (req, res) {
    const category = prepareCategory(req.body);

    getCategory(category.id)
        .then(([oldCategory]) => {
            editCategoryQuery(category)
                .then(category => {
                    if (oldCategory.hidden === category.hidden) {
                        return category;
                    }

                    return toggleHiddenNewsByCategory(category.id, category.hidden)
                        .then(() => category);
                })
                .then(category => {
                    res.status(OKEY_STATUS_CODE).send(category);
                })
                .catch((err) => {
                    if (err.code === MONGODB_DUPLICATE_CODE) {
                        return res.status(NOT_FOUND_STATUS_CODE).send({ code: 'duplication' });
                    }

                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        });
}
