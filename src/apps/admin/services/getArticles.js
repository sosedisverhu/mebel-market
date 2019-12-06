import request from 'superagent';
import base from './base';

import setArticlesAction from '../actions/setArticles';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getArticles () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/article/all')
                .query({ token })
        )
            .then(articles => {
                return dispatch(setArticlesAction(articles));
            });
    };
}
