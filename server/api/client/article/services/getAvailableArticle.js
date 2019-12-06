import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getArticleById from '../queries/getArticleById';
import editArticle from '../queries/editArticle';

import getArticleValues from '../utils/getArticleValues';

export default function getAvailableArticle (req, res) {
    const { id } = req.query;

    getArticleById(id)
        .then(([article]) => {
            if (!article || article.hidden) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            article.views = (article.views || 0) + 1;

            editArticle(article)
                .then((article) => {
                    res.status(OKEY_STATUS_CODE).send(...getArticleValues(article));
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
