import { combineReducers } from 'redux';

import application from './application';
import products from './products';
import articles from './articles';
import partners from './partners';

const reducers = combineReducers({
    application,
    products,
    articles,
    partners
});

export default reducers;
