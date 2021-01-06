import Product from '../model';

export default function deleteProductsBySubCategory (ids) {
    return Product.deleteMany({ subCategoryId: { $in: ids } });
}
