/* eslint-disable max-len */
const md5 = require('md5');

module.exports = [
    {
        login: 'admin',
        password: md5('admin'),
        email: 'dev.occam@gmail.com',
        id: 'admin_id',
        sections: ['main', 'products', 'articles', 'credentials', 'partners', 'seo', 'admins'],
        isMain: true
    },
    {
        login: 'admin2',
        password: md5('admin2'),
        email: 'dev.occam@gmail.com',
        id: 'admin_id2',
        sections: ['main', 'products']
    }
];
