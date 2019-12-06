import request from 'superagent';
import base from './base';

import setArticlesAction from '../actions/setArticles';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function saveArticle (ids) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .post('/api/admin/article/delete-few')
                .send({ ids })
                .query({ token })
        )
            .then(articles => {
                return dispatch(setArticlesAction(articles));
            });
    };
}
