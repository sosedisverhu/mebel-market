import SubCategory from '../model';

export default function nullifyCategories (ids) {
    return SubCategory.find({ id: { $in: ids } });
}
