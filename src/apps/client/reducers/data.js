import {
    SET_ARTICLES,
    SET_PRODUCTS,
    SET_CATEGORIES,
    SET_SUB_CATEGORIES,
    SET_PARTNERS,
    SET_SCROLL_TO_CHARACTERISTIC
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
    categories: [],
    subCategories: [],
    partners: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_ARTICLES:
        return { ...state, articles: action.payload };
    case SET_SCROLL_TO_CHARACTERISTIC:
        return { ...state, scrollToCharacteristic: action.payload };
    case SET_PRODUCTS:
        return { ...state, products: action.payload };
    case SET_CATEGORIES:
        return { ...state, categories: action.payload };
    case SET_SUB_CATEGORIES:
        return { ...state, subCategories: action.payload };
    case SET_PARTNERS:
        return { ...state, partners: action.payload };
    default:
        return state;
    }
}
