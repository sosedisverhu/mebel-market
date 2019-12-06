import { SET_ARTICLES, SET_CATEGORIES } from '../types/types';

const initialState = {
    products: [
        {
            photos: [
                '/src/apps/client/ui/components/Card/img/products/antalya.jpg',
                '/src/apps/client/ui/components/Card/img/products/antalya.jpg'
            ],
            sizes: [
                {
                    size: 'S',
                    price: 1399,
                    id: 'k2t24q68'
                },
                {
                    size: 'M',
                    price: 1599,
                    id: 'k2t24wl4'
                },
                {
                    size: 'L',
                    price: 1999,
                    id: 'k2t250qz'
                }
            ],
            price: 1399,
            basePrice: 2798,
            labels: [
                'top'
            ],
            texts: {
                ua: {
                    name: 'Кровать « Прага »',
                    description: '[ua] Lorem ipsum dolor sit amet',
                    seoTitle: '[ua] Прага',
                    seoDescription: '[ua] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ua] sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum'
                },
                ru: {
                    name: 'Кровать « Прага »',
                    description: '[ru] Lorem ipsum dolor sit amet',
                    seoTitle: '[ru] Прага',
                    seoDescription: '[ru] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ru] dolore, eu, fugiat, nulla, pariatur., Excepteur, sint, occaecat, cupidatat, non'
                }
            },
            id: '1hcbx2aak2t27huq',
            date: 1573423510382
        },
        {
            photos: [
                '/src/apps/client/ui/components/Card/img/products/bed-classic.jpg'
            ],
            sizes: [
                {
                    size: 'S',
                    price: 1399,
                    id: 'k2t24q68'
                },
                {
                    size: 'M',
                    price: 1599,
                    id: 'k2t24wl4'
                },
                {
                    size: 'L',
                    price: 1999,
                    id: 'k2t250qz'
                }
            ],
            price: '1 399',
            basePrice: '2798',
            discountPrice: 50,
            labels: [
                'top'
            ],
            texts: {
                ua: {
                    name: 'Кровать « Классика »',
                    description: '[ua] Lorem ipsum dolor sit amet',
                    seoTitle: '[ua] Прага',
                    seoDescription: '[ua] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ua] sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum'
                },
                ru: {
                    name: 'Кровать « Классика »',
                    description: '[ru] Lorem ipsum dolor sit amet',
                    seoTitle: '[ru] Прага',
                    seoDescription: '[ru] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ru] dolore, eu, fugiat, nulla, pariatur., Excepteur, sint, occaecat, cupidatat, non'
                }
            },
            id: '1hcbx2aak2t27hu1',
            date: 1573423510381
        },
        {
            photos: [
                '/src/apps/client/ui/components/Card/img/products/bed-gloria.jpg'
            ],
            sizes: [
                {
                    size: 'S',
                    price: 1399,
                    id: 'k2t24q68'
                },
                {
                    size: 'M',
                    price: 1599,
                    id: 'k2t24wl4'
                },
                {
                    size: 'L',
                    price: 1999,
                    id: 'k2t250qz'
                }
            ],
            price: '2 199',
            labels: [
                'top'
            ],
            texts: {
                ua: {
                    name: 'Кровать « Глория »',
                    description: '[ua] Lorem ipsum dolor sit amet',
                    seoTitle: '[ua] Прага',
                    seoDescription: '[ua] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ua] sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum'
                },
                ru: {
                    name: 'Кровать « Глория »',
                    description: '[ru] Lorem ipsum dolor sit amet',
                    seoTitle: '[ru] Прага',
                    seoDescription: '[ru] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ru] dolore, eu, fugiat, nulla, pariatur., Excepteur, sint, occaecat, cupidatat, non'
                }
            },
            id: '1hcbx2aak2t27hu2',
            date: 1573423510380
        },
        {
            photos: [
                '/src/apps/client/ui/components/Card/img/products/bed-antalya.jpg'
            ],
            sizes: [
                {
                    size: 'S',
                    price: 1399,
                    id: 'k2t24q68'
                },
                {
                    size: 'M',
                    price: 1599,
                    id: 'k2t24wl4'
                },
                {
                    size: 'L',
                    price: 1999,
                    id: 'k2t250qz'
                }
            ],
            price: '2 199',
            labels: [
                'top'
            ],
            texts: {
                ua: {
                    name: 'Кровать « Анталия »',
                    description: '[ua] Lorem ipsum dolor sit amet',
                    seoTitle: '[ua] Прага',
                    seoDescription: '[ua] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ua] sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum'
                },
                ru: {
                    name: 'Кровать « Анталия »',
                    description: '[ru] Lorem ipsum dolor sit amet',
                    seoTitle: '[ru] Прага',
                    seoDescription: '[ru] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ru] dolore, eu, fugiat, nulla, pariatur., Excepteur, sint, occaecat, cupidatat, non'
                }
            },
            id: '1hcbx2aak2t27hu4',
            date: 1573423510399
        },
        {
            photos: [
                '/src/apps/client/ui/components/Card/img/products/bed-praga.jpg'
            ],
            sizes: [
                {
                    size: 'S',
                    price: 1399,
                    id: 'k2t24q68'
                },
                {
                    size: 'M',
                    price: 1599,
                    id: 'k2t24wl4'
                },
                {
                    size: 'L',
                    price: 1999,
                    id: 'k2t250qz'
                }
            ],
            price: '1 399',
            labels: [
                'top'
            ],
            texts: {
                ua: {
                    name: 'Кровать « Прага »',
                    description: '[ua] Lorem ipsum dolor sit amet',
                    seoTitle: '[ua] Прага',
                    seoDescription: '[ua] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ua] sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum'
                },
                ru: {
                    name: 'Кровать « Прага »',
                    description: '[ru] Lorem ipsum dolor sit amet',
                    seoTitle: '[ru] Прага',
                    seoDescription: '[ru] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ru] dolore, eu, fugiat, nulla, pariatur., Excepteur, sint, occaecat, cupidatat, non'
                }
            },
            id: '1hcbx2aak2t27h24',
            date: 1573423510382
        },
        {
            photos: [
                '/src/apps/client/ui/components/Card/img/products/bed-classic.jpg'
            ],
            sizes: [
                {
                    size: 'S',
                    price: 1399,
                    id: 'k2t24q68'
                },
                {
                    size: 'M',
                    price: 1599,
                    id: 'k2t24wl4'
                },
                {
                    size: 'L',
                    price: 1999,
                    id: 'k2t250qz'
                }
            ],
            price: '1 399',
            basePrice: '2 798',
            discountPrice: 50,
            labels: [
                'top'
            ],
            texts: {
                ua: {
                    name: 'Кровать « Классика »',
                    description: '[ua] Lorem ipsum dolor sit amet',
                    seoTitle: '[ua] Прага',
                    seoDescription: '[ua] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ua] sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum'
                },
                ru: {
                    name: 'Кровать « Классика »',
                    description: '[ru] Lorem ipsum dolor sit amet',
                    seoTitle: '[ru] Прага',
                    seoDescription: '[ru] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ru] dolore, eu, fugiat, nulla, pariatur., Excepteur, sint, occaecat, cupidatat, non'
                }
            },
            id: '1hcbx2aak2t27h23',
            date: 1573423510381
        },
        {
            photos: [
                '/src/apps/client/ui/components/Card/img/products/bed-gloria.jpg'
            ],
            sizes: [
                {
                    size: 'S',
                    price: 1399,
                    id: 'k2t24q68'
                },
                {
                    size: 'M',
                    price: 1599,
                    id: 'k2t24wl4'
                },
                {
                    size: 'L',
                    price: 1999,
                    id: 'k2t250qz'
                }
            ],
            price: '2 199',
            labels: [
                'top'
            ],
            texts: {
                ua: {
                    name: 'Кровать « Глория »',
                    description: '[ua] Lorem ipsum dolor sit amet',
                    seoTitle: '[ua] Прага',
                    seoDescription: '[ua] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ua] sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum'
                },
                ru: {
                    name: 'Кровать « Глория »',
                    description: '[ru] Lorem ipsum dolor sit amet',
                    seoTitle: '[ru] Прага',
                    seoDescription: '[ru] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ru] dolore, eu, fugiat, nulla, pariatur., Excepteur, sint, occaecat, cupidatat, non'
                }
            },
            id: '1hcbx2aak2t27h22',
            date: 1573423510380
        },
        {
            photos: [
                '/src/apps/client/ui/components/Card/img/products/bed-antalya.jpg'
            ],
            sizes: [
                {
                    size: 'S',
                    price: 1399,
                    id: 'k2t24q68'
                },
                {
                    size: 'M',
                    price: 1599,
                    id: 'k2t24wl4'
                },
                {
                    size: 'L',
                    price: 1999,
                    id: 'k2t250qz'
                }
            ],
            price: '2 199',
            labels: [
                'top'
            ],
            texts: {
                ua: {
                    name: 'Кровать « Анталия »',
                    description: '[ua] Lorem ipsum dolor sit amet',
                    seoTitle: '[ua] Прага',
                    seoDescription: '[ua] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ua] sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum'
                },
                ru: {
                    name: 'Кровать « Анталия »',
                    description: '[ru] Lorem ipsum dolor sit amet',
                    seoTitle: '[ru] Прага',
                    seoDescription: '[ru] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ru] dolore, eu, fugiat, nulla, pariatur., Excepteur, sint, occaecat, cupidatat, non'
                }
            },
            id: '1hcbx2aak2t27h21',
            date: 1573423510399
        },
        {
            photos: [
                '/src/apps/client/ui/components/Card/img/products/bed-praga.jpg'
            ],
            sizes: [
                {
                    size: 'S',
                    price: 1399,
                    id: 'k2t24q68'
                },
                {
                    size: 'M',
                    price: 1599,
                    id: 'k2t24wl4'
                },
                {
                    size: 'L',
                    price: 1999,
                    id: 'k2t250qz'
                }
            ],
            price: '1 399',
            labels: [
                'top'
            ],
            texts: {
                ua: {
                    name: 'Кровать « Прага »',
                    description: '[ua] Lorem ipsum dolor sit amet',
                    seoTitle: '[ua] Прага',
                    seoDescription: '[ua] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ua] sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum'
                },
                ru: {
                    name: 'Кровать « Прага »',
                    description: '[ru] Lorem ipsum dolor sit amet',
                    seoTitle: '[ru] Прага',
                    seoDescription: '[ru] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ru] dolore, eu, fugiat, nulla, pariatur., Excepteur, sint, occaecat, cupidatat, non'
                }
            },
            id: '1hcbx2aak2t27h15',
            date: 1573423510382
        },
        {
            photos: [
                '/src/apps/client/ui/components/Card/img/products/bed-classic.jpg'
            ],
            sizes: [
                {
                    size: 'S',
                    price: 1399,
                    id: 'k2t24q68'
                },
                {
                    size: 'M',
                    price: 1599,
                    id: 'k2t24wl4'
                },
                {
                    size: 'L',
                    price: 1999,
                    id: 'k2t250qz'
                }
            ],
            price: '1 399',
            basePrice: '2 798',
            discountPrice: 50,
            labels: [
                'top'
            ],
            texts: {
                ua: {
                    name: 'Кровать « Классика »',
                    description: '[ua] Lorem ipsum dolor sit amet',
                    seoTitle: '[ua] Прага',
                    seoDescription: '[ua] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ua] sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum'
                },
                ru: {
                    name: 'Кровать « Классика »',
                    description: '[ru] Lorem ipsum dolor sit amet',
                    seoTitle: '[ru] Прага',
                    seoDescription: '[ru] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ru] dolore, eu, fugiat, nulla, pariatur., Excepteur, sint, occaecat, cupidatat, non'
                }
            },
            id: '1hcbx2aak2t27h14',
            date: 1573423510381
        },
        {
            photos: [
                '/src/apps/client/ui/components/Card/img/products/bed-gloria.jpg'
            ],
            sizes: [
                {
                    size: 'S',
                    price: 1399,
                    id: 'k2t24q68'
                },
                {
                    size: 'M',
                    price: 1599,
                    id: 'k2t24wl4'
                },
                {
                    size: 'L',
                    price: 1999,
                    id: 'k2t250qz'
                }
            ],
            price: '2 199',
            labels: [
                'top'
            ],
            texts: {
                ua: {
                    name: 'Кровать « Глория »',
                    description: '[ua] Lorem ipsum dolor sit amet',
                    seoTitle: '[ua] Прага',
                    seoDescription: '[ua] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ua] sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum'
                },
                ru: {
                    name: 'Кровать « Глория »',
                    description: '[ru] Lorem ipsum dolor sit amet',
                    seoTitle: '[ru] Прага',
                    seoDescription: '[ru] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ru] dolore, eu, fugiat, nulla, pariatur., Excepteur, sint, occaecat, cupidatat, non'
                }
            },
            id: '1hcbx2aak2t27h13',
            date: 1573423510380
        },
        {
            photos: [
                '/src/apps/client/ui/components/Card/img/products/bed-antalya.jpg'
            ],
            sizes: [
                {
                    size: 'S',
                    price: 1399,
                    id: 'k2t24q68'
                },
                {
                    size: 'M',
                    price: 1599,
                    id: 'k2t24wl4'
                },
                {
                    size: 'L',
                    price: 1999,
                    id: 'k2t250qz'
                }
            ],
            price: '2 199',
            labels: [
                'top'
            ],
            texts: {
                ua: {
                    name: 'Кровать « Анталия »',
                    description: '[ua] Lorem ipsum dolor sit amet',
                    seoTitle: '[ua] Прага',
                    seoDescription: '[ua] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ua] sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum'
                },
                ru: {
                    name: 'Кровать « Анталия »',
                    description: '[ru] Lorem ipsum dolor sit amet',
                    seoTitle: '[ru] Прага',
                    seoDescription: '[ru] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ru] dolore, eu, fugiat, nulla, pariatur., Excepteur, sint, occaecat, cupidatat, non'
                }
            },
            id: '1hcbx2aak2t27h12',
            date: 1573423510399
        }
    ],
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
    categories: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_ARTICLES:
        return { ...state, articles: action.payload };
    case SET_CATEGORIES:
        return { ...state, articles: action.payload };
    default:
        return state;
    }
}
