import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'id',
    'texts',
    'avatar',
    'files',
    'youTubeVideo',
    'hidden',
    'date',
    'alias'
];

export default function getNewsItemValues (product) {
    return pick(VALUES, product);
}
