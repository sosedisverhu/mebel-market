/* eslint-disable max-len */
const md5 = require('md5');

module.exports = {
    login: 'admin',
    password: md5('admin'),
    email: 'dev.occam@gmail.com',
    id: 'admin_id',
    isMain: true,
    sections: ['orders', 'main', 'products', 'articles', 'reviews', 'partners', 'seo', 'admins', 'credentials']
};
