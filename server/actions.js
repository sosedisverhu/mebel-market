import getMobileDetect from '../src/apps/client/services/server/getMobileDetect';
import getLangFromRoute from '../src/apps/client/services/server/getLangFromRoute';
import getArticles from '../src/apps/client/services/server/getArticles';
import getProducts from '../src/apps/client/services/server/getProducts';
import getCategories from '../src/apps/client/services/server/getCategories';
import getSubCategories from '../src/apps/client/services/server/getSubCategories';

export default [
    getMobileDetect,
    getLangFromRoute,
    getArticles,
    getCategories,
    getSubCategories,
    getProducts
];
