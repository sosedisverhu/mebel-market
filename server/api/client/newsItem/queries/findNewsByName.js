import NewsItem from '../model';

export default function findNewsByName (text) {
    return NewsItem.find({
        '$or': [
            { 'texts.ru.name': { $regex: text, $options: 'i' } },
            { 'texts.ua.name': { $regex: text, $options: 'i' } }
        ]
    });
}
