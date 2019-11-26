/* eslint-disable no-console */
const { Seeder } = require('mongo-seeding');
const path = require('path');

const DATABASE_URL = 'mongodb://localhost/mebel-market';

const config = {
    database: DATABASE_URL,
    dropDatabase: true
};

const seeder = new Seeder(config);

const collections = seeder.readCollectionsFromPath(path.resolve('server/seeds/data'));

seeder
    .import(collections)
    .then(() => {
        console.log('Success!');
    })
    .catch(err => {
        console.log(err);
    });
