import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import tar from 'tar';
import path from 'path';

import multipart from '../../../../helpers/multipart';
import rimraf from 'rimraf';

const uploader = multipart();

const FILES_FOLDER = path.join(__dirname, '../src/apps/admin/files');
const ADMIN_FOLDER = path.join(__dirname, '../src/apps/admin');

export default function uploadFiles (req, res) {
    try {
        uploader(req, res, (err) => {
            if (err || !req.files[0]) {
                return res.status(SERVER_ERROR_STATUS_CODE).end();
            }

            const file = req.files[0];
            const tarPath = `${FILES_FOLDER}/${file.filename}`;

            tar.extract(
                { file: tarPath, C: ADMIN_FOLDER }
            )
                .then(err => {
                    if (err) {
                        return res.status(SERVER_ERROR_STATUS_CODE).end();
                    }

                    rimraf.sync(tarPath);

                    res.status(OKEY_STATUS_CODE).end();
                })
                .catch(() => {
                    return res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
