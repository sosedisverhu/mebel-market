import {
    SET_ARTICLES,
    SET_PRODUCTS,
    SET_CATEGORIES,
    SET_SUB_CATEGORIES,
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
    partners: [
        {
            url: '/src/apps/client/ui/pages/Partners/img/fusion-metal.png',
            alt: 'Fusion Metal',
            texts: {
                ru: {
                    name: 'Fusion Metal',
                    text: '[ru] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu tincidunt eros. Duis elementum nisl sed mi sollicitudin aliquet.'
                },
                ua: {
                    name: 'Fusion Metal',
                    text: '[ua] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu tincidunt eros. Duis elementum nisl sed mi sollicitudin aliquet.'
                }
            }
        },
        {
            url: '/src/apps/client/ui/pages/Partners/img/emm.png',
            alt: 'Emm',
            texts: {
                ru: {
                    name: 'EMM',
                    text: '[ru] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu tincidunt eros. Duis elementum nisl sed mi sollicitudin aliquet.'
                },
                ua: {
                    name: 'EMM',
                    text: '[ua] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu tincidunt eros. Duis elementum nisl sed mi sollicitudin aliquet.'
                }
            }
        },
        {
            url: '/src/apps/client/ui/pages/Partners/img/matroluxe.png',
            alt: 'Matroluxe',
            texts: {
                ru: {
                    name: 'Matroluxe',
                    text: '[ru] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu tincidunt eros. Duis elementum nisl sed mi sollicitudin aliquet.'
                },
                ua: {
                    name: 'Matroluxe',
                    text: '[ua] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu tincidunt eros. Duis elementum nisl sed mi sollicitudin aliquet.'
                }
            }
        },
        {
            url: '/src/apps/client/ui/pages/Partners/img/fusion-metal.png',
            alt: 'Fusion Metal',
            texts: {
                ru: {
                    name: 'Fusion Metal',
                    text: '[ru] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu tincidunt eros. Duis elementum nisl sed mi sollicitudin aliquet.'
                },
                ua: {
                    name: 'Fusion Metal',
                    text: '[ua] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu tincidunt eros. Duis elementum nisl sed mi sollicitudin aliquet.'
                }
            }
        },
        {
            url: '/src/apps/client/ui/pages/Partners/img/matroluxe.png',
            alt: 'Matroluxe',
            texts: {
                ru: {
                    name: 'Matroluxe',
                    text: '[ru] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu tincidunt eros. Duis elementum nisl sed mi sollicitudin aliquet.'
                },
                ua: {
                    name: 'Matroluxe',
                    text: '[ua] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu tincidunt eros. Duis elementum nisl sed mi sollicitudin aliquet.'
                }
            }
        }
    ],
    articles: [],
    products: [],
    categories: [],
    subCategories: [],
    basket: [],
    wishlist: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_ARTICLES:
        return { ...state, articles: action.payload };
    case SET_PRODUCTS:
        return { ...state, products: action.payload };
    case SET_CATEGORIES:
        return { ...state, categories: action.payload };
    case SET_SUB_CATEGORIES:
        return { ...state, subCategories: action.payload };
    case SET_BASKET:
        return { ...state, basket: action.payload };
    case SET_WISHLIST:
        return { ...state, wishlist: action.payload };
    default:
        return state;
    }
}
