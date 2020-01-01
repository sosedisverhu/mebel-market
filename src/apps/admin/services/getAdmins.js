import request from 'superagent';
import base from './base';

import setAdminsAction from '../actions/setAdmins';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getAdmins () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/authentication/admin')
                .query({ token })
        )
            .then(admins => {
                return dispatch(setAdminsAction(admins));
            });
    };
}
