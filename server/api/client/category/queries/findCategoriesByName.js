import Category from '../model';

export default function findCategoriesByName (text) {
    return Category.find({ '$or': [
        { name: { $regex: text, $options: 'i' } }
    ]
    });
}
