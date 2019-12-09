import SubCategory from '../model';

export default function getSubCategoryById (id) {
    return SubCategory.find({ id });
}
