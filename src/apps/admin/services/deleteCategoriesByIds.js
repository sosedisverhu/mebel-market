import request from 'superagent';
import base from './base';

import setCategoriesAction from '../actions/setCategories';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function deleteCategory (ids) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .post('/api/admin/category/delete')
                .send({ ids })
                .query({ token })
        )
            .then(categories => {
                return dispatch(setCategoriesAction(categories));
            });
    };
}
