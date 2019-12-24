import pick from '@tinkoff/utils/object/pick';

const VALUES = ['id', 'texts', 'hidden', 'steps'];

export default function prepareQuiz (body) {
    return pick(VALUES, body);
}
