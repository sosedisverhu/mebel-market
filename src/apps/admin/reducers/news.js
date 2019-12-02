import {
    SET_NEWS,
    SET_FILTERED_NEWS
} from '../types/types';

const initialState = {
    news: [],
    filteredNews: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_NEWS:
        return { ...state, news: action.payload };
    case SET_FILTERED_NEWS:
        return { ...state, filtered: action.payload };
    default:
        return state;
    }
}
