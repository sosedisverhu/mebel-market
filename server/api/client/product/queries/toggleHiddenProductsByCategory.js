import News from '../model';

export default function toggleHiddenProductsByCategory (categoryId, hidden) {
    return News.updateMany({ categoryId: categoryId }, { hidden });
}
