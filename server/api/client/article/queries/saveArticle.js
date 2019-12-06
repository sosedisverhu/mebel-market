import Article from '../model';

export default function saveArticle (article) {
    return Article.create(article);
};
