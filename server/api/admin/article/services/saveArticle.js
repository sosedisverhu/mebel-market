import uniqid from 'uniqid';

import {
    MONGODB_DUPLICATE_CODE,
    NOT_FOUND_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';

import prepareArticle from '../utils/prepareArticle';

import saveArticleQuery from '../../../client/article/queries/saveArticle';

export default function saveArticle (req, res) {
    const article = prepareArticle(req.body);
    const id = uniqid();
    const date = Date.now();

    saveArticleQuery({ ...article, date, id })
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
