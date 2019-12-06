import Article from '../model';

export default function getAllArticles () {
    return Article.find({});
}
