import Partner from '../model';

export default function findPartnersByName (text) {
    return Partner.find({
        '$or': [
            { 'texts.ru.name': { $regex: text, $options: 'i' } },
            { 'texts.ua.name': { $regex: text, $options: 'i' } }
        ]
    });
}
