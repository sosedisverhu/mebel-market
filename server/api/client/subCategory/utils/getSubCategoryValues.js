import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'id',
    'texts',
    'hidden',
    'categoryId',
    'alias',
    'positionIndex',
    'filters'
];

export default function getSubCategoryValues (product) {
    return pick(VALUES, product);
}
