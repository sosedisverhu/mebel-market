import request from 'superagent';
import base from './base';

import authenticateAction from '../actions/authenticate';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function authenticate (credentials) {
    return dispatch => base(
        request
            .post('/api/admin/authentication/authenticate')
            .send(credentials)
    )
        .then(payload => {
            localStorage.setItem(TOKEN_LOCAL_STORAGE_NAME, payload.token);

            dispatch(authenticateAction(payload.user));

            return payload;
        });
}
