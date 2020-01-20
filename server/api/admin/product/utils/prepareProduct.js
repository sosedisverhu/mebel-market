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
    'discountPrice',
    'price',
    'actualPrice',
    'discount',
    'warranty',
    'categoryId',
    'subCategoryId',
    'alias',
    'categoryFilters',
    'subCategoryFilters',
    'article'
];

export default function prepareProduct (body) {
    return pick(VALUES, body);
}
