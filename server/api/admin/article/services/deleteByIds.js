import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllArticles from '../../../client/article/queries/getAllArticles';
import deleteByIdsQuery from '../../../client/article/queries/deleteByIds';

export default function deleteByIds (req, res) {
    const { ids } = req.body;

    deleteByIdsQuery(ids)
        .then(() => {
            getAllArticles()
                .then(articles => {
                    res.status(OKEY_STATUS_CODE).send(articles);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
