import request from 'superagent';
import base from '../base';

import setArticles from '../../actions/setArticles';

export default function getProducts (req) {
    return dispatch => {
        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/client/article/all`)
                .timeout({
                    deadline: 2000
                })
        )
            .then(articles => {
                dispatch(setArticles(articles));
            })
            .catch(() => {
                return dispatch(setArticles([]));
            });
    };
}
