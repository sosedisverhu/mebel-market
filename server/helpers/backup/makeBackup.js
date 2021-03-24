const backup = require('mongodb-backup');
const path = require('path');
const format = require('date-fns/format');

const DATABASE_URL = 'mongodb://localhost/mebel-market';
const BACKUPS_FOLDER = path.join(__dirname, '..', '..', '..', 'backups');

backup({
    uri: DATABASE_URL,
    root: BACKUPS_FOLDER,
    parser: 'json',
    tar: `dump-${format(new Date(), 'yyyy-MM-dd')}.tar`
});
