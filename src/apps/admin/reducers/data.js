import {
    SET_PRODUCTS,
    SET_ARTICLES,
    SET_CATEGORIES,
    SET_SUB_CATEGORIES,
    SET_PARTNERS,
    SET_QUIZZES
} from '../types/types';

const initialState = {
    products: [],
    articles: [],
    categories: [],
    subCategories: [],
    partners: [],
    quizzes: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_PRODUCTS:
        return { ...state, products: action.payload };
    case SET_ARTICLES:
        return { ...state, articles: action.payload };
    case SET_CATEGORIES:
        return { ...state, categories: action.payload };
    case SET_SUB_CATEGORIES:
        return { ...state, subCategories: action.payload };
    case SET_PARTNERS:
        return { ...state, partners: action.payload };
        case SET_QUIZZES:
        return { ...state, quizzes: action.payload };
    default:
        return state;
    }
}
