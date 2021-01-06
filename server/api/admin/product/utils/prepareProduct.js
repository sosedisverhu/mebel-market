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
    'minDiscountPrice',
    'minPrice',
    'actualPrice',
    'minDiscount',
    'warranty',
    'categoryId',
    'subCategoryId',
    'alias',
    'categoryFilters',
    'subCategoryFilters',
    'labels',
    'exist',
    'viewOneColor'
];

export default function prepareProduct (body) {
    return pick(VALUES, body);
}
