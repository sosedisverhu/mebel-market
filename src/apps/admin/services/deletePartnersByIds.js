import request from 'superagent';
import base from './base';

import setPartners from '../actions/setPartners';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function deletePartners (ids) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .post('/api/admin/partner/delete-few')
                .send({ ids })
                .query({ token })
        )
            .then(partners => {
                return dispatch(setPartners(partners));
            });
    };
}
