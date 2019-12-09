import request from 'superagent';
import base from './base';

import setPartnersAction from '../actions/setPartners';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function setPartners () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/partner/all')
                .query({ token })
        )
            .then(partners => {
                return dispatch(setPartnersAction(partners));
            });
    };
}
