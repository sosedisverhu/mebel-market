import backup from 'mongodb-backup';
import schedule from 'node-schedule';
import path from 'path';
import fs from 'fs';
import format from 'date-fns/format';
import rimraf from 'rimraf';

import { DATABASE_URL } from '../../constants/constants';

const BACKUPS_FOLDER = path.join(__dirname, '..', 'backups');
const FILE_NAME_REGEX = /dump-/;

let lastDumpName = null;
let preLastDumpName = null;

export default function backups () {
    if (process.env.NODE_ENV !== 'production') {
        return;
    }

    if (!fs.existsSync(BACKUPS_FOLDER)) {
        fs.mkdirSync(BACKUPS_FOLDER);
    }

    fs.readdirSync(BACKUPS_FOLDER)
        .map(fileName => {
            if (!FILE_NAME_REGEX.test(fileName)) {
                return null;
            }

            const fileDateSrc = fileName.slice(5).slice(0, -4);
            const [year, month, day] = fileDateSrc.split('-');

            return {
                name: fileName,
                date: +(new Date(+year, +month, +day))
            };
        })
        .filter(file => !!file)
        .sort((prevItem, nextItem) => nextItem.date - prevItem.date)
        .forEach((file, i) => {
            if (i === 0) {
                lastDumpName = file.name;
            } else if (i === 1) {
                preLastDumpName = file.name;
            } else {
                rimraf.sync(path.join(BACKUPS_FOLDER, file.name));
            }
        });

    schedule.scheduleJob({ hour: 1 }, (time) => {
        const dumpName = `dump-${format(time, 'yyyy-MM-dd')}.tar`;

        if (preLastDumpName) {
            rimraf.sync(path.join(BACKUPS_FOLDER, preLastDumpName));
        }

        if (lastDumpName) {
            preLastDumpName = lastDumpName;
        }

        lastDumpName = dumpName;

        backup({
            uri: DATABASE_URL,
            root: BACKUPS_FOLDER,
            parser: 'json',
            tar: dumpName
        });
    });
}
