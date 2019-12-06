import Article from '../model';

export default function nullifyCategories (ids) {
    return Article.find({ id: { $in: ids } });
}
