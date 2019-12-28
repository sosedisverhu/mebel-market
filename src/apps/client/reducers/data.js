import {
    SET_ARTICLES,
    SET_PRODUCTS,
    SET_REVIEWS,
    SET_CATEGORIES,
    SET_SUB_CATEGORIES,
    SET_PARTNERS,
    SET_SCROLL_TO_CHARACTERISTIC,
    SET_BASKET,
    SET_WISHLIST
} from '../types/types';

const initialState = {
    labels: ['top', 'discount'],
    mainSlides: [
        {
            'path': '/src/apps/client/ui/components/Slider/img/slides/slide1.jpg'
        },
        {
            'path': '/src/apps/client/ui/components/Slider/img/slides/slide1.jpg'
        },
        {
            'path': '/src/apps/client/ui/components/Slider/img/slides/slide1.jpg'
        },
        {
            'path': '/src/apps/client/ui/components/Slider/img/slides/slide1.jpg'
        }
    ],
    articles: [],
    products: [],
    reviews: [],
    categories: [],
    subCategories: [],
    partners: [],
    basket: [],
    wishlist: []
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
    default:
        return state;
    }
}
