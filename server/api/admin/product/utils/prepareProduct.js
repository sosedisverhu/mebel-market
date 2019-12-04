import pick from '@tinkoff/utils/object/pick';

const VALUES = ['id', 'texts', 'avatar', 'files', 'hidden', 'date', 'price', 'categoryId', 'subCategoryId', 'alias'];

export default function prepareProduct (body) {
    return pick(VALUES, body);
}
