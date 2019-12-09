/* eslint-disable max-len */

module.exports = [
    {
        id: 'category0',
        texts: {
            ru: {
                name: 'Кровати',
                subCategory: [
                    { name: 'Металлические кровати', value: 'metal', id: 'metal' },
                    { name: 'Деревянные кровати', value: 'wooden', id: 'wooden' },
                    { name: 'Двухъярусные кровати', value: 'two-tier', id: 'two-tier' }
                ]
            },
            ua: {
                name: 'Ліжка',
                subCategory: [
                    { name: 'Металеві ліжка', value: 'metal', id: 'metal' },
                    { name: 'Дерев\'яні ліжка', value: 'wooden', id: 'wooden' },
                    { name: 'Двоярусні ліжка', value: 'two-tier', id: 'two-tier' }
                ]
            }
        },
        hidden: false,
        positionIndex: 0,
        alias: 'beds'
    },
    {
        id: 'category1',
        texts: {
            ru: {
                name: 'Матрасы',
                subCategory: [
                    { name: 'Пружинные матрасы', value: 'spring', id: 'spring' },
                    { name: 'Беспружинные матрасы', value: 'no-spring', id: 'no-spring' }
                ]
            },
            ua: {
                name: 'Матраци',
                subCategory: [
                    { name: 'Пружинні матраци', value: 'spring', id: 'spring' },
                    { name: 'Безпружинні матраци', value: 'no-spring', id: 'no-spring' }
                ]
            }
        },
        hidden: false,
        positionIndex: 1,
        alias: 'mattresses'
    },
    {
        id: 'category2',
        texts: {
            ru: {
                name: 'Мягкая мебель',
                subCategory: [
                    { name: 'Диваны', value: 'sofas', id: 'sofas' },
                    { name: 'Угловые диваны', value: 'corner-sofa', id: 'corner-sofa' },
                    { name: 'Детские диваны', value: 'kids-sofa', id: 'kids-sofa' }
                ]
            },
            ua: {
                name: 'М\'які меблі',
                subCategory: [
                    { name: 'Дивани', value: 'sofas', id: 'sofas' },
                    { name: 'Кутові дивани', value: 'corner-sofa', id: 'corner-sofa' },
                    { name: 'Детячі дивани', value: 'kids-sofa', id: 'kids-sofa' }
                ]
            }
        },
        hidden: false,
        positionIndex: 2,
        alias: 'soft-furniture'
    },
    {
        id: 'category3',
        texts: {
            ru: {
                name: 'Аксессуары для сна',
                subCategory: [
                    { name: 'Подушки', value: 'pillows', id: 'pillows' },
                    { name: 'Одеяла', value: 'blankets', id: 'blankets' },
                    { name: 'Наматрасники', value: 'mattress-covers', id: 'mattress-covers' }
                ]
            },
            ua: {
                name: 'Аксесуари для сну',
                subCategory: [
                    { name: 'Подушки', value: 'pillows', id: 'pillows' },
                    { name: 'Ковдри', value: 'blankets', id: 'blankets' },
                    { name: 'Наматрацники', value: 'mattress-covers', id: 'mattress-covers' }
                ]
            }
        },
        hidden: false,
        positionIndex: 3,
        alias: 'accessories'
    }
];
