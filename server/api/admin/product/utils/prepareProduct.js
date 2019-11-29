import pick from '@tinkoff/utils/object/pick';

const VALUES = ['id', 'texts', 'avatar', 'files', 'hidden', 'views', 'date', 'price', 'categoryId', 'subCategoryId'];

export default function prepareProduct (body) {
    return pick(VALUES, body);
}
