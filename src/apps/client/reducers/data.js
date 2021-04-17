import {
    SET_ARTICLES,
    SET_PRODUCTS,
    SET_REVIEWS,
    SET_CATEGORIES,
    SET_SUB_CATEGORIES,
    SET_PARTNERS,
    SET_SCROLL_TO_CHARACTERISTIC,
    SET_BASKET,
    SET_WISHLIST,
    OPEN_BASKET,
    CLOSE_BASKET,
    SET_MAIN_SLIDES,
    SET_ALL_SHARES
} from '../types/types';

const initialState = {
    labels: ['top', 'discount'],
    articles: [],
    products: [],
    reviews: [],
    categories: [],
    subCategories: [],
    partners: [],
    basket: [],
    wishlist: [],
    basketIsOpen: false,
    slider: {},
    allShares: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_ARTICLES:
        return { ...state, articles: action.payload };
    case SET_SCROLL_TO_CHARACTERISTIC:
        return { ...state, scrollToCharacteristic: action.payload };
    case SET_PRODUCTS:
        return { ...state, products: action.payload };
    case SET_REVIEWS:
        return { ...state, reviews: action.payload };
    case SET_CATEGORIES:
        return { ...state, categories: action.payload };
    case SET_SUB_CATEGORIES:
        return { ...state, subCategories: action.payload };
    case SET_PARTNERS:
        return { ...state, partners: action.payload };
    case SET_BASKET:
        return { ...state, basket: action.payload };
    case SET_WISHLIST:
        return { ...state, wishlist: action.payload };
    case OPEN_BASKET:
        return { ...state, basketIsOpen: true };
    case CLOSE_BASKET:
        return { ...state, basketIsOpen: false };
    case SET_MAIN_SLIDES:
        return { ...state, slider: action.payload };
    case SET_ALL_SHARES:
        return { ...state, allShares: action.payload };
    default:
        return state;
    }
}
