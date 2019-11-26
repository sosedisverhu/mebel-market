import Category from '../model';

export default function deleteByIds (ids) {
    return Category.deleteMany({ id: { $in: ids } });
}
