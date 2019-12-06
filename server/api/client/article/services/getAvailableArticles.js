import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllArticles from '../queries/getAllArticles';

export default function getAvailableArticles (req, res) {
    getAllArticles()
        .then(articles => {
            const availableArticles = articles
                .filter(article => !article.hidden)
                .sort((prev, next) => next.date - prev.date);

            res.status(OKEY_STATUS_CODE).send(availableArticles);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
