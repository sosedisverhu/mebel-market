import request from 'superagent';
import base from './base';

import setCategoriesAction from '../actions/setCategories';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getCategories () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/category/all')
                .query({ token })
        )
            .then(categories => {
                return dispatch(setCategoriesAction(categories));
            });
    };
}
