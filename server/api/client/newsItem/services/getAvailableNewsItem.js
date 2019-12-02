import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getNewsItemById from '../queries/getNewsItemById';
import editNewsItem from '../queries/editNewsItem';

import getNewsItemValues from '../utils/getNewsItemValues';

export default function getAvailableNewsItem (req, res) {
    const { id } = req.query;

    getNewsItemById(id)
        .then(([newsItem]) => {
            if (!newsItem || newsItem.hidden) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            newsItem.views = (newsItem.views || 0) + 1;

            editNewsItem(newsItem)
                .then((newsItem) => {
                    res.status(OKEY_STATUS_CODE).send(...getNewsItemValues(newsItem));
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
