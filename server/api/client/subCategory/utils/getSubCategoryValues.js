import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'id',
    'texts',
    'hidden',
    'categoryId',
    'alias'
];

export default function getSubCategoryValues (product) {
    return pick(VALUES, product);
}
