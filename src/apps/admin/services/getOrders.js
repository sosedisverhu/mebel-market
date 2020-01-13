import request from 'superagent';
import base from './base';

import setOrders from '../actions/setOrders';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getOrders () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/order/all')
                .query({ token })
        )
            .then(orders => {
                return dispatch(setOrders(orders));
            });
    };
}
