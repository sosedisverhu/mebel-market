import { combineReducers } from 'redux';

import application from './application';
import data from './data';

const reducers = combineReducers({
    application,
    data
});

export default reducers;
