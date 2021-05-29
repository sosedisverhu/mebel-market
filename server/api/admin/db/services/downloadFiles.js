import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import tar from 'tar';
import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

const TEMP_FOLDER = path.join(__dirname, 'api/admin/db/temp');
const ADMIN_FOLDER = path.join(__dirname, '../src/apps/admin');
const FILES_FOLDER = path.join(__dirname, '../src/apps/admin/files');

export default function downloadFiles (req, res) {
    try {
        if (!fs.existsSync(FILES_FOLDER)) {
            fs.mkdirSync(FILES_FOLDER);
        }

        if (fs.existsSync(TEMP_FOLDER)) {
            rimraf.sync(TEMP_FOLDER);
        }
        fs.mkdirSync(TEMP_FOLDER);

        tar.create(
            { file: `${TEMP_FOLDER}/files.tar`, C: ADMIN_FOLDER },
            ['files']
        )
            .then(err => {
                if (err) {
                    return res.status(SERVER_ERROR_STATUS_CODE).end();
                }

                const host = req.get('host');

                res.status(OKEY_STATUS_CODE).send(`${req.protocol}://${host}/server/api/admin/db/temp/files.tar`);
            })
            .catch(() => {
                return res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        return res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
