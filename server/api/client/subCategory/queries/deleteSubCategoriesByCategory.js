import SubCategory from '../model';

export default function deleteByIds (ids) {
    return SubCategory.deleteMany({ categoryId: { $in: ids } });
}
