import pick from '@tinkoff/utils/object/pick';

const VALUES = ['name', 'texts'];

export default function prepareProduct (body) {
    return pick(VALUES, body);
}
