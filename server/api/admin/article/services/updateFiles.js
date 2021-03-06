import fs from 'fs';
import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE, ARTICLES_ITEM_FILE_FIELD_NAME_REGEX } from '../../../../constants/constants';

import editArticleQuery from '../../../client/article/queries/editArticle';

import multipart from '../../../../helpers/multipart';

import noop from '@tinkoff/utils/function/noop';

const uploader = multipart(ARTICLES_ITEM_FILE_FIELD_NAME_REGEX);

export default function updateFiles (req, res) {
    uploader(req, res, (err) => {
        if (err) {
            return res.status(SERVER_ERROR_STATUS_CODE).end();
        }

        const filesPaths = [];
        const files = req.files;
        const { id } = req.query;
        const oldFiles = JSON.parse(req.body.oldFiles);
        const removedFiles = JSON.parse(req.body.removedFiles);

        files.forEach(file => {
            filesPaths[file.fieldname.replace(ARTICLES_ITEM_FILE_FIELD_NAME_REGEX, '')] = `/${file.path.replace(/\\/g, '/')}`;
        });
        oldFiles.forEach((file) => {
            filesPaths[file.index] = file.path;
        });
        removedFiles.forEach(function (file) {
            fs.unlink(file.path.slice(1), noop);
        });

        editArticleQuery({ files: filesPaths, id })
            .then(article => {
                res.status(OKEY_STATUS_CODE).send(article);
            })
            .catch(() => {
                filesPaths.forEach(function (filename) {
                    fs.unlink(filename.slice(1), noop);
                });

                return res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    });
}
