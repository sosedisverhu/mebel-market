import { SET_CATEGORIES } from '../types/types';

const setNewsCategories = payload => ({
    type: SET_CATEGORIES,
    payload
});

export default setNewsCategories;
