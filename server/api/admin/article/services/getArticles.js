import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllArticles from '../../../client/article/queries/getAllArticles';

export default function getArticles (req, res) {
    getAllArticles()
        .then(articles => {
            res.status(OKEY_STATUS_CODE).send(articles);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
