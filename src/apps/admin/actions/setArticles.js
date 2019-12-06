import { SET_ARTICLES } from '../types/types';

const setArticles = payload => ({
    type: SET_ARTICLES,
    payload
});

export default setArticles;
