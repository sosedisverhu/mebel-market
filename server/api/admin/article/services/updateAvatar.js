import fs from 'fs';
import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE, ARTICLES_ITEM_AVATAR_FIELD_NAME_REGEX } from '../../../../constants/constants';

import editArticleQuery from '../../../client/article/queries/editArticle';
import getArticleById from '../../../client/article/queries/getArticleById';

import multipart from '../../../../helpers/multipart';

import noop from '@tinkoff/utils/function/noop';

const uploader = multipart(ARTICLES_ITEM_AVATAR_FIELD_NAME_REGEX);

export default function updateAvatar (req, res) {
    const { id } = req.query;

    getArticleById(id)
        .then(([article]) => {
            uploader(req, res, (err) => {
                if (err) {
                    return res.status(SERVER_ERROR_STATUS_CODE).end();
                }

                article.avatar && fs.unlink(article.avatar.slice(1), noop);

                const files = req.files;
                const avatar = `/${files[0].path.replace(/\\/g, '/')}`;

                editArticleQuery({ avatar, id })
                    .then(article => {
                        res.status(OKEY_STATUS_CODE).send(article);
                    })
                    .catch(() => {
                        fs.unlink(avatar.slice(1), noop);

                        return res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            });
        })
        .catch(() => {
            return res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
