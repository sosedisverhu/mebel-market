import { SET_ARTICLES } from '../types/types';

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
                    description: '<h4>[ua] Особенности конструкции</h4><p>В ногах кровати отсутствует спинка, что делает её визуально более просторной. Кровать стоит на четырёх ножках, с довольно высоким ложем, так что на неё удобно ложиться и с неё без труда можно встать. Также это облегчает уборку и, при желании, перестановку мебели в комнате. Элегантность, изысканность и стильное оформление понравятся всем ценителям качественной и красивой мебели.</p><h4>Цена на кровать АНТАЛИЯ</h4><p>Цена на металлическую кровать АНТАЛИЯ доступна среднему покупателю, поэтому её покупка – выгодное и экономически обоснованное вложение. Такая кровать даст возможность сэкономить ваш бюджет и не потерять в качестве. Покупая кровать из металла, вы успешно вкладываете деньги в интерьер своего дома и обеспечиваете себе комфортный сон. А как известно, крепкий и здоровый сон – залог здоровья.</p><h4>Плюсы материала</h4><p>Каркас кровати выполнен из бесшовных металлических труб, что обеспечивает его высокую прочность. Материал является огнеупорным и защищён от влаги. Сломать или поцарапать металлический каркас очень сложно, что обеспечивает долговечность этого изделия. Кровать АНТАЛИЯ от бренда Fusion Metal способна выдерживать нагрузку до 200 килограммов. Износостойкость металла является дополнительным плюсом при выборе этой кровати. Чистка кровати от пыли не займёт много времени, а большего ухода и не требуется.</p><h4>Использование</h4><p>Как небольшая уютная спальня, так и красивый гостиничный номер станут идеальным местом для кровати АНТАЛИЯ. Такие стили интерьера, как неоклассика, минимализм и хай-тек, станут отличным выбором при оформлении спальни, и кровать АНТАЛИЯ будет смотреться в таком интерьере гармонично и оригинально. Единственное, что необходимо для завершения обустройства идеального спального места на этой кровати – покупка качественных, удобных аксессуаров для сна и красивого постельного белья, чтобы подчеркнуть необычный стиль дизайна.</p>',
                    seoTitle: '[ua] Прага',
                    seoDescription: '[ua] Lorem ipsum dolor sit amet',
                    seoKeywords: '[ua] sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum'
                },
                ru: {
                    name: 'Кровать « Прага »',
                    description: '<h4>[ru] Особенности конструкции</h4><p>В ногах кровати отсутствует спинка, что делает её визуально более просторной. Кровать стоит на четырёх ножках, с довольно высоким ложем, так что на неё удобно ложиться и с неё без труда можно встать. Также это облегчает уборку и, при желании, перестановку мебели в комнате. Элегантность, изысканность и стильное оформление понравятся всем ценителям качественной и красивой мебели.</p><h4>Цена на кровать АНТАЛИЯ</h4><p>Цена на металлическую кровать АНТАЛИЯ доступна среднему покупателю, поэтому её покупка – выгодное и экономически обоснованное вложение. Такая кровать даст возможность сэкономить ваш бюджет и не потерять в качестве. Покупая кровать из металла, вы успешно вкладываете деньги в интерьер своего дома и обеспечиваете себе комфортный сон. А как известно, крепкий и здоровый сон – залог здоровья.</p><h4>Плюсы материала</h4><p>Каркас кровати выполнен из бесшовных металлических труб, что обеспечивает его высокую прочность. Материал является огнеупорным и защищён от влаги. Сломать или поцарапать металлический каркас очень сложно, что обеспечивает долговечность этого изделия. Кровать АНТАЛИЯ от бренда Fusion Metal способна выдерживать нагрузку до 200 килограммов. Износостойкость металла является дополнительным плюсом при выборе этой кровати. Чистка кровати от пыли не займёт много времени, а большего ухода и не требуется.</p><h4>Использование</h4><p>Как небольшая уютная спальня, так и красивый гостиничный номер станут идеальным местом для кровати АНТАЛИЯ. Такие стили интерьера, как неоклассика, минимализм и хай-тек, станут отличным выбором при оформлении спальни, и кровать АНТАЛИЯ будет смотреться в таком интерьере гармонично и оригинально. Единственное, что необходимо для завершения обустройства идеального спального места на этой кровати – покупка качественных, удобных аксессуаров для сна и красивого постельного белья, чтобы подчеркнуть необычный стиль дизайна.</p>',
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
    articles: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_ARTICLES:
        return { ...state, articles: action.payload };
    default:
        return state;
    }
}
