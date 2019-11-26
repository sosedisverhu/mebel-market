import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'id',
    'texts',
    'avatar',
    'files',
    'hidden',
    'views',
    'date',
    'price',
    'categoryId'
];

export default function getProductValues (product) {
    return pick(VALUES, product);
}
