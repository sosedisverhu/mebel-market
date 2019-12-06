import Category from '../model';

export default function getCategoryById (id) {
    return Category.find({ id });
}
