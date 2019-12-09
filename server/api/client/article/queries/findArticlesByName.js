import Article from '../model';

export default function findArticlesByName (text) {
    return Article.find({
        '$or': [
            { 'texts.ru.name': { $regex: text, $options: 'i' } },
            { 'texts.ua.name': { $regex: text, $options: 'i' } }
        ]
    });
}
