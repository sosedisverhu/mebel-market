import NewsItem from '../model';

export default function getNewsItemById (id) {
    return NewsItem.find({ id });
}
