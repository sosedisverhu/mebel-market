import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllNews from '../queries/getAllNews';

export default function getAvailableNews (req, res) {
    getAllNews()
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
