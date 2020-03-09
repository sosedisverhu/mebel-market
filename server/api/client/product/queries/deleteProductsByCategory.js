import Product from '../model';

export default function deleteProductsByCategory (ids) {
    return Product.deleteMany({ categoryId: { $in: ids } });
}
