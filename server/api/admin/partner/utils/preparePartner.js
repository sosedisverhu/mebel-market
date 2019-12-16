import pick from '@tinkoff/utils/object/pick';

const VALUES = ['id', 'texts', 'hidden'];

export default function preparePartner (body) {
    return pick(VALUES, body);
}
