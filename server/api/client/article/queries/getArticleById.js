import Article from '../model';

export default function getArticleById (id) {
    return Article.find({ id });
}
