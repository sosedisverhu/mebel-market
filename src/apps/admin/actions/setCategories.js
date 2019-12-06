import { SET_CATEGORIES } from '../types/types';

const setCategories = payload => ({
    type: SET_CATEGORIES,
    payload
});

export default setCategories;
