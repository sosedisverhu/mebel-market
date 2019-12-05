import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE, MONGODB_DUPLICATE_CODE } from '../../../../constants/constants';

import prepareArticle from '../utils/prepareArticle';

import editArticleQuery from '../../../client/article/queries/editArticle';

export default function editArticle (req, res) {
    const article = prepareArticle(req.body);

    editArticleQuery(article)
        .then(article => {
            res.status(OKEY_STATUS_CODE).send(article);
        })
        .catch((err) => {
            if (err.code === MONGODB_DUPLICATE_CODE) {
                return res.status(NOT_FOUND_STATUS_CODE).send({ code: 'duplication' });
            }

            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
