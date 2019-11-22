const initialState = {
    products: [
        {
            photos: [
                '/src/apps/client/img/products/antalya.jpg',
                '/src/apps/client/img/products/antalya.jpg',
                '/src/apps/client/img/products/antalya.jpg',
                '/src/apps/client/img/products/antalya.jpg',
                '/src/apps/client/img/products/antalya.jpg',
                '/src/apps/client/img/products/antalya.jpg'
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
            priceOld: 2798,
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
        }
    ],
    'mainSlides': [
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
    ]
};

export default function (state = initialState, action) {
    switch (action.type) {
    default:
        return state;
    }
}
