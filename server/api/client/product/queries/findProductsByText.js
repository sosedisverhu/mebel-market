import Product from '../model';

export default function findProductsByText (text) {
    return Product.find({ '$or': [
        { 'texts.ua.name': { $regex: text, $options: 'i' } },
        { 'texts.ru.name': { $regex: text, $options: 'i' } },
        { 'texts.ua.description': { $regex: text, $options: 'i' } },
        { 'texts.ru.description': { $regex: text, $options: 'i' } }
    ] });
}
