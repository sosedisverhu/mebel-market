import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareArticle from '../utils/prepareArticle';

import editArticleQuery from '../../../client/article/queries/editArticle';

export default function editArticle (req, res) {
    const article = prepareArticle(req.body);

    editArticleQuery(article)
        .then(article => {
            res.status(OKEY_STATUS_CODE).send(article);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
