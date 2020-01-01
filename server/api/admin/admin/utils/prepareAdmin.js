import pick from '@tinkoff/utils/object/pick';

const VALUES = ['login', 'email', 'password', 'id', 'sections'];

export default function prepareAdmin (body) {
    return pick(VALUES, body);
}
