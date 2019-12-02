import NewsItem from '../model';

export default function deleteByIds (ids) {
    return NewsItem.deleteMany({ id: { $in: ids } });
}
