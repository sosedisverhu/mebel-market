import Product from '../model';

export default function getProductsInCategory (categoryId) {
    return Product.find({ categoryId });
}
