import Category from '../model';

export default function getCategoriesByIds (ids) {
    return Category.find({ id: { $in: ids } });
}
