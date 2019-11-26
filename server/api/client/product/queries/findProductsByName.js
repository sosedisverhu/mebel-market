import Product from '../model';

export default function findProductsByName (text) {
    return Product.find({
        '$or': [
            { 'texts.ru.name': { $regex: text, $options: 'i' } },
            { 'texts.ua.name': { $regex: text, $options: 'i' } }
        ]
    });
}
