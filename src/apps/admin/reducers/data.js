import {
    SET_PRODUCTS,
    SET_ARTICLES,
    SET_CATEGORIES,
    SET_SUB_CATEGORIES,
    SET_PARTNERS,
    SET_REVIEWS,
    SET_SEO,
    SET_ADMINS,
    SET_ORDERS
} from '../types/types';

const initialState = {
    products: [],
    articles: [],
    categories: [],
    subCategories: [],
    partners: [],
    reviews: [],
    allSeo: [],
    admins: [],
    orders: []
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
    case SET_REVIEWS:
        return { ...state, reviews: action.payload };
    case SET_SEO:
        return { ...state, allSeo: action.payload };
    case SET_ADMINS:
        return { ...state, admins: action.payload };
    case SET_ORDERS:
        return { ...state, orders: action.payload };
    default:
        return state;
    }
}
