import getMobileDetect from '../src/apps/client/services/server/getMobileDetect';
import getLangFromRoute from '../src/apps/client/services/server/getLangFromRoute';
// import getProductsCategories from '../src/apps/client/services/server/getProductsCategories';
import getArticles from '../src/apps/client/services/server/getArticles';
import getPartners from '../src/apps/client/services/server/getPartners';

export default [
    getMobileDetect,
    getLangFromRoute,
    getArticles,
    getPartners
    // getProductsCategories
];
