import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllNews from '../../../client/newsItem/queries/getAllNews';
import deleteByIdsQuery from '../../../client/newsItem/queries/deleteByIds';

export default function deleteByIds (req, res) {
    const { ids } = req.body;

    deleteByIdsQuery(ids)
        .then(() => {
            getAllNews()
                .then(news => {
                    res.status(OKEY_STATUS_CODE).send(news);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
