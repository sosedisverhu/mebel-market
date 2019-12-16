import request from 'superagent';
import base from './base';

import setSubCategoriesAction from '../actions/setSubCategories';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function deleteSubCategory (ids) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .post('/api/admin/subCategory/delete-few')
                .send({ ids })
                .query({ token })
        )
            .then(subCategories => {
                return dispatch(setSubCategoriesAction(subCategories));
            });
    };
}
