import Product from '../model';

export default function getProductsInSubCategory (subCategoryId) {
    return Product.find({ subCategoryId });
}
