import request from 'superagent';
import base from './base';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';
import setSeo from '../actions/setSeo';

export default function getAllSeo () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/seo/')
                .query({ token })
        )
            .then(seo => {
                return dispatch(setSeo(seo));
            });
    };
}
