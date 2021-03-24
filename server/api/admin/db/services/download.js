import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    DATABASE_URL
} from '../../../../constants/constants';

import backup from 'mongodb-backup';
import format from 'date-fns/format';
import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

const TEMP_FOLDER = path.join(__dirname, 'api/admin/db/temp');

export default function download (req, res) {
    try {
        const dumpName = `dump-${format(new Date(), 'yyyy-MM-dd')}.tar`;

        if (fs.existsSync(TEMP_FOLDER)) {
            rimraf.sync(TEMP_FOLDER);
        }
        fs.mkdirSync(TEMP_FOLDER);

        backup({
            uri: DATABASE_URL,
            root: TEMP_FOLDER,
            parser: 'json',
            tar: dumpName,
            callback: (err) => {
                if (err) {
                    return res.status(SERVER_ERROR_STATUS_CODE).end();
                }

                const host = req.get('host');

                res.status(OKEY_STATUS_CODE).send(`${req.protocol}://${host}/server/api/admin/db/temp/${dumpName}`);
            }
        });
    } catch (e) {
        return res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
