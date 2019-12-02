import pick from '@tinkoff/utils/object/pick';

const VALUES = ['id', 'texts', 'avatar', 'files', 'youTubeVideo', 'hidden', 'date', 'alias'];

export default function prepareNewsItem (body) {
    return pick(VALUES, body);
}
