import Category from '../model';

export default function getAllCategories () {
    return Category.find({});
}
