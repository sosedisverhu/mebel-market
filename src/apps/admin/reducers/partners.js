import {
    SET_PARTNERS,
    SET_FILTERED_PARTNERS
} from '../types/types';

const initialState = {
    partners: [],
    filteredArticles: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_PARTNERS:
        return { ...state, partners: action.payload };
    case SET_FILTERED_PARTNERS:
        return { ...state, filtered: action.payload };
    default:
        return state;
    }
}
