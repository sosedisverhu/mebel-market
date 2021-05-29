import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE, DATABASE_URL } from '../../../../constants/constants';

import path from 'path';
import rimraf from 'rimraf';
import restore from 'mongodb-restore';

import multipart from '../../../../helpers/multipart';

const uploader = multipart();

const FILES_FOLDER = path.join(__dirname, '../src/apps/admin/files');

export default function upload (req, res) {
    try {
        uploader(req, res, (err) => {
            if (err || !req.files[0]) {
                return res.status(SERVER_ERROR_STATUS_CODE).end();
            }

            const file = req.files[0];
            const tarPath = `${FILES_FOLDER}/${file.filename}`;

            restore({
                uri: DATABASE_URL,
                root: FILES_FOLDER,
                parser: 'json',
                tar: file.filename,
                drop: true,
                callback: (err) => {
                    if (err) {
                        return res.status(SERVER_ERROR_STATUS_CODE).end();
                    }

                    rimraf.sync(tarPath);

                    return res.status(OKEY_STATUS_CODE).end();
                }
            });

            res.status(OKEY_STATUS_CODE).send(`/${file.path.replace(/\\/g, '/')}`);
        });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
