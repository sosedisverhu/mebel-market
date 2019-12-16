import Product from '../model';

export default function toggleHiddenProductsByCategory (categoryId, hidden) {
    return Product.updateMany({ categoryId: categoryId }, { hidden });
}
