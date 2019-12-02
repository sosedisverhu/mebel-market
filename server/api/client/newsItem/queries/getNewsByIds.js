import NewsItem from '../model';

export default function nullifyCategories (ids) {
    return NewsItem.find({ id: { $in: ids } });
}
