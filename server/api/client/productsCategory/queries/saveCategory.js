import Category from '../model';

export default function saveCategory (category) {
    return Category.create(category);
}
