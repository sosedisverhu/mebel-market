import getMobileDetect from '../src/apps/client/services/server/getMobileDetect';
import getLangFromRoute from '../src/apps/client/services/server/getLangFromRoute';

import getCategories from '../src/apps/client/services/server/getCategories';

import getArticles from '../src/apps/client/services/server/getArticles';

export default [
    getMobileDetect,
    getLangFromRoute,
    getArticles,
    getCategories
];
