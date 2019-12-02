import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getNewsByIds from '../queries/getNewsByIds';

export default function getAvailableNewsByIds (req, res) {
    const ids = req.body;

    getNewsByIds(ids)
        .then(news => {
            const availableNews = news
                .filter(newsItem => !newsItem.hidden)
                .sort((prev, next) => next.date - prev.date);

            res.status(OKEY_STATUS_CODE).send(availableNews);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
