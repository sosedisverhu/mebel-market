import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'id',
    'texts',
    'views',
    'characteristics',
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
    'subCategoryFilters'
];

export default function getProductValues (product) {
    return pick(VALUES, product);
}
