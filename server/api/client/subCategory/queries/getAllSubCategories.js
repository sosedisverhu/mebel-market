import SubCategory from '../model';

export default function getAllSubCategories () {
    return SubCategory.find({});
}
