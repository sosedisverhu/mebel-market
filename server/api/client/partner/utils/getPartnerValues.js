import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'id',
    'texts',
    'hidden',
    'logo'
];

export default function getPartnerValues (product) {
    return pick(VALUES, product);
}
