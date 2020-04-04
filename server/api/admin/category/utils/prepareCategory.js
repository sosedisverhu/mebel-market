import pick from '@tinkoff/utils/object/pick';

const VALUES = ['texts', 'hidden', 'id', 'positionIndex', 'alias', 'filters', 'colorFilter', 'sizeFilter'];

export default function prepareCategory (body) {
    return pick(VALUES, body);
}
