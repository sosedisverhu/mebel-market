import request from 'superagent';
import base from './base';

import setNewsAction from '../actions/setNews';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getNews () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/newsItem/all')
                .query({ token })
        )
            .then(news => {
                return dispatch(setNewsAction(news));
            });
    };
}
