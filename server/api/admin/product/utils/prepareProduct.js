import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'id',
    'texts',
    'characteristics',
    'warranty',
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
    'filters'
];

export default function prepareProduct (body) {
    return pick(VALUES, body);
}
