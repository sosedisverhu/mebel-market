import { combineReducers } from 'redux';

import application from './application';
import products from './products';
import orders from './orders';
import articles from './articles';

const reducers = combineReducers({
    application,
    products,
    orders,
    articles
});

export default reducers;
