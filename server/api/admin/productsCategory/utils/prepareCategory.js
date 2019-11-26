import pick from '@tinkoff/utils/object/pick';

const VALUES = ['texts', 'hidden', 'id', 'positionIndex'];

export default function prepareCategory (body) {
    return pick(VALUES, body);
}
