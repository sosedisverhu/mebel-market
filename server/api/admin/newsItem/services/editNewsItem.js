import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareNewsItem from '../utils/prepareNewsItem';

import editNewsItemQuery from '../../../client/newsItem/queries/editNewsItem';

export default function editNewsItem (req, res) {
    const newsItem = prepareNewsItem(req.body);

    editNewsItemQuery(newsItem)
        .then(newsItem => {
            res.status(OKEY_STATUS_CODE).send(newsItem);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
