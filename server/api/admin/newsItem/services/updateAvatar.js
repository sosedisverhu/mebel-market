import fs from 'fs';
import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE, NEWS_ITEM_AVATAR_FIELD_NAME_REGEX } from '../../../../constants/constants';

import editNewsItemQuery from '../../../client/newsItem/queries/editNewsItem';
import getNewsItemById from '../../../client/newsItem/queries/getNewsItemById';

import multipart from '../../../../helpers/multipart';

import noop from '@tinkoff/utils/function/noop';

const uploader = multipart(NEWS_ITEM_AVATAR_FIELD_NAME_REGEX);

export default function updateAvatar (req, res) {
    const { id } = req.query;

    getNewsItemById(id)
        .then(([newsItem]) => {
            uploader(req, res, (err) => {
                if (err) {
                    return res.status(SERVER_ERROR_STATUS_CODE).end();
                }

                newsItem.avatar && fs.unlink(newsItem.avatar.slice(1), noop);

                const files = req.files;
                const avatar = `/${files[0].path.replace(/\\/g, '/')}`;

                editNewsItemQuery({ avatar, id })
                    .then(newsItem => {
                        res.status(OKEY_STATUS_CODE).send(newsItem);
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
