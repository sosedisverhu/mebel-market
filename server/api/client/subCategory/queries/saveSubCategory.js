import SubCategory from '../model';

export default function saveSubCategory (subCategory) {
    return SubCategory.create(subCategory);
}
