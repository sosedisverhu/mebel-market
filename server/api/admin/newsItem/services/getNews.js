import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllNews from '../../../client/newsItem/queries/getAllNews';

export default function getNews (req, res) {
    getAllNews()
        .then(news => {
            res.status(OKEY_STATUS_CODE).send(news);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
