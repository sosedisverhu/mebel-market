import Category from '../model';

export default function editCategory (category) {
    return Category.findOneAndUpdate({ id: category.id }, category, { new: true });
}
