import pick from '@tinkoff/utils/object/pick';

const VALUES = ['user', 'checked', 'date', 'id', 'productId'];

export default function prepareReview (body) {
    return pick(VALUES, body);
}
