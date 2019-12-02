import { combineReducers } from 'redux';

import application from './application';
import products from './products';
import news from './news';

const reducers = combineReducers({
    application,
    products,
    news
});

export default reducers;
