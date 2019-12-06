import Article from '../model';

export default function editArticle (articleItem) {
    return Article.findOneAndUpdate({ id: articleItem.id }, articleItem, { new: true });
}
