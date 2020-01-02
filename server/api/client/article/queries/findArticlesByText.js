import Article from '../model';

export default function findArticlesByText (text) {
    return Article.find({ '$or': [
        { 'texts.ua.name': { $regex: text, $options: 'i' } },
        { 'texts.ru.name': { $regex: text, $options: 'i' } },
        { 'texts.ua.preview': { $regex: text, $options: 'i' } },
        { 'texts.ru.preview': { $regex: text, $options: 'i' } },
        { 'texts.ua.content': { $regex: text, $options: 'i' } },
        { 'texts.ru.content': { $regex: text, $options: 'i' } }
    ] });
}
