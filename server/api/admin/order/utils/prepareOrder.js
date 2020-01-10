import pick from '@tinkoff/utils/object/pick';

const VALUES = ['comment', 'status', 'id'];

export default function prepareOrder (body) {
    return pick(VALUES, body);
}
