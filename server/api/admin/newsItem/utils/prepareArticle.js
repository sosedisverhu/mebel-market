import pick from '@tinkoff/utils/object/pick';

const VALUES = ['id', 'texts', 'hidden', 'date', 'alias'];

export default function prepareArticle (body) {
    return pick(VALUES, body);
}
