import { SET_PRODUCTS_CATEGORIES } from '../types/types';

const setNewsCategories = payload => ({
    type: SET_PRODUCTS_CATEGORIES,
    payload
});

export default setNewsCategories;
