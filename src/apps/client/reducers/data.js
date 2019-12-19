import {
    SET_ARTICLES,
    SET_PRODUCTS,
    SET_CATEGORIES,
    SET_SUB_CATEGORIES,
    SET_PARTNERS
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
    partners: [],
    quizes: [
        {
            name: 'name1',
            title: 'Размер кровати',
            options: [
                {
                    id: '11',
                    value: 'single',
                    img: '/src/apps/client/ui/pages/QuizesPage/img/bed1.jpg',
                    text: 'Односпальная'
                },
                {
                    id: '12',
                    value: 'double',
                    img: '/src/apps/client/ui/pages/QuizesPage/img/bed1.jpg',
                    text: 'Двуспальная'
                },
                {
                    id: '13',
                    value: 'two-tier',
                    img: '/src/apps/client/ui/pages/QuizesPage/img/bed1.jpg',
                    text: 'Двухъярусная'
                }
            ]

        },
        {
            name: 'name2',
            title: 'Размер кровати 2',
            options: [
                {
                    id: '21',
                    value: 'single2',
                    img: '/src/apps/client/ui/pages/QuizesPage/img/bed1.jpg',
                    text: 'Односпальная 2'
                },
                {
                    id: '22',
                    value: 'double2',
                    img: '/src/apps/client/ui/pages/QuizesPage/img/bed1.jpg',
                    text: 'Двуспальная 2'
                },
                {
                    id: '23',
                    value: 'two-tier2',
                    img: '/src/apps/client/ui/pages/QuizesPage/img/bed1.jpg',
                    text: 'Двухъярусная 2'
                }
            ]
        },
        {
            name: 'name3',
            title: 'Размер кровати 3',
            options: [
                {
                    id: '31',
                    value: 'single3',
                    img: '/src/apps/client/ui/pages/QuizesPage/img/bed1.jpg',
                    text: 'Односпальная 3'
                },
                {
                    id: '32',
                    value: 'double3',
                    img: '/src/apps/client/ui/pages/QuizesPage/img/bed1.jpg',
                    text: 'Двуспальная 3'
                },
                {
                    id: '33',
                    value: 'two-tie3',
                    img: '/src/apps/client/ui/pages/QuizesPage/img/bed1.jpg',
                    text: 'Двухъярусная 3'
                }
            ]
        },
        {
            name: 'name4',
            title: 'Размер кровати 4',
            options: [
                {
                    id: '1',
                    value: 'single4',
                    img: '/src/apps/client/ui/pages/QuizesPage/img/bed1.jpg',
                    text: 'Односпальная 4'
                },
                {
                    id: '2',
                    value: 'double4',
                    img: '/src/apps/client/ui/pages/QuizesPage/img/bed1.jpg',
                    text: 'Двуспальная 4'
                },
                {
                    id: '3',
                    value: 'two-tie4',
                    img: '/src/apps/client/ui/pages/QuizesPage/img/bed1.jpg',
                    text: 'Двухъярусная 4'
                }
            ]
        }
    ]
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
    case SET_PARTNERS:
        return { ...state, partners: action.payload };
    default:
        return state;
    }
}
