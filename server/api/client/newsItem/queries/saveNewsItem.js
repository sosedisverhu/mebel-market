import NewsItem from '../model';

export default function saveNewsItem (newsItem) {
    return NewsItem.create(newsItem);
};
