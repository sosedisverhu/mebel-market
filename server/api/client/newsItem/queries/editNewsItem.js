import NewsItem from '../model';

export default function editNewsItem (newsItem) {
    return NewsItem.findOneAndUpdate({ id: newsItem.id }, newsItem, { new: true });
}
