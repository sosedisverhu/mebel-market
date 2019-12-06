import {
    SET_ARTICLES,
    SET_FILTERED_ARTICLES
} from '../types/types';

const initialState = {
    articles: [],
    filteredArticles: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_ARTICLES:
        return { ...state, articles: action.payload };
    case SET_FILTERED_ARTICLES:
        return { ...state, filtered: action.payload };
    default:
        return state;
    }
}
