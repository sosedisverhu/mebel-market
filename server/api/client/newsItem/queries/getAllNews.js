import NewsItem from '../model';

export default function getAllNews () {
    return NewsItem.find({});
}
