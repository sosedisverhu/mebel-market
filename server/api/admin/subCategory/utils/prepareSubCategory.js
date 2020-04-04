import pick from '@tinkoff/utils/object/pick';

const VALUES = ['id', 'texts', 'hidden', 'categoryId', 'alias', 'positionIndex', 'filters', 'colorFilter', 'sizeFilter'];

export default function prepareSubCategory (body) {
    return pick(VALUES, body);
}
