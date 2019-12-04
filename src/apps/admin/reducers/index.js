import { combineReducers } from 'redux';

import application from './application';
import products from './products';
import articles from './articles';

const reducers = combineReducers({
    application,
    products,
    articles
});

export default reducers;
