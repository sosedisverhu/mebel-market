import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'id',
    'texts',
    'hidden',
    'steps'
];

export default function getQuizValues (product) {
    return pick(VALUES, product);
}
