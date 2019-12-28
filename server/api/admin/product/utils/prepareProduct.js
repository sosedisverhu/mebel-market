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
    'discount',
    'categoryId',
    'subCategoryId',
    'alias',
    'categoryFilters',
    'subCategoryFilters'
];

export default function prepareProduct (body) {
    return pick(VALUES, body);
}
