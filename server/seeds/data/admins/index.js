/* eslint-disable max-len */
const md5 = require('md5');

module.exports = [
    {
        login: 'admin',
        password: md5('admin'),
        email: 'dev.occam@gmail.com',
        id: 'admin_id',
        sections: ['orders', 'products', 'partners', 'articles'],
        isMain: true
    }
];
