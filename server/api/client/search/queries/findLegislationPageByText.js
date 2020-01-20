import Laws from '../../euroLaw/model';

export default function findNewsByText (text) {
    return Laws.find({ '$or': [
        { 'texts.ua.name': { $regex: text, $options: 'i' } },
        { 'texts.en.name': { $regex: text, $options: 'i' } }
    ] });
}
