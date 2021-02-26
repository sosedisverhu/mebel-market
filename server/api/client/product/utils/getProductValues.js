import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'id',
    'texts',
    'views',
    'characteristics',
    'features',
    'sizes',
    'avatar',
    'files',
    'hidden',
    'date',
    'basePrice',
    'price',
    'actualPrice',
    'discount',
    'warranty',
    'categoryId',
    'subCategoryId',
    'alias',
    'categoryFilters',
    'subCategoryFilters',
    'labels',
    'viewOneColor'
];

export default function getProductValues (product) {
    return pick(VALUES, product);
}
