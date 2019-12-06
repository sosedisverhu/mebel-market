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
    'price',
    'discount',
    'categoryId',
    'subCategoryId',
    'alias'
];

export default function getProductValues (product) {
    return pick(VALUES, product);
}
