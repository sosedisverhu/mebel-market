import SubCategory from '../model';

export default function editSubCategory (subCategory) {
    return SubCategory.findOneAndUpdate({ id: subCategory.id }, subCategory, { new: true });
}
