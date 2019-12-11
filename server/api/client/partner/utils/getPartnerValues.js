import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'id',
    'texts',
    'hidden',
    'alias',
    'logo'
];

export default function getPartnerValues (product) {
    return pick(VALUES, product);
}
