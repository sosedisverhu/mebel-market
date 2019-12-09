import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import findArticleByName from '../queries/findArticlesByName';

export default function availableArticlesSearch (req, res) {
    const { text } = req.query;

    findArticleByName(text)
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
