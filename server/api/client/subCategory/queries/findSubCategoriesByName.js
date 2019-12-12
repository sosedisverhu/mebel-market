import SubCategory from '../model';

export default function findSubCategoriesByName (text) {
    return SubCategory.find({
        '$or': [
            { 'texts.ru.name': { $regex: text, $options: 'i' } },
            { 'texts.ua.name': { $regex: text, $options: 'i' } }
        ]
    });
}
