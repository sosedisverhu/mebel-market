import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'texts',
    'id',
    'hidden',
    'alias',
    'filters'
];

export default function getCategoryValues (category) {
    return pick(VALUES, category);
}
