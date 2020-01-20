import {
    SET_AUTHENTICATED,
    SET_MAIN_SLIDES
} from '../types/types';

const initialState = {
    authenticated: null,
    mainSlides: [],
    productsCategories: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_AUTHENTICATED:
        return { ...state, authenticated: action.payload };
    case SET_MAIN_SLIDES:
        return { ...state, mainSlides: action.payload };
    default:
        return state;
    }
}
