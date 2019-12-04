import { combineReducers } from 'redux';

import application from './application';
import products from './products';
import orders from './orders';

const reducers = combineReducers({
    application,
    products,
    orders
});

export default reducers;
