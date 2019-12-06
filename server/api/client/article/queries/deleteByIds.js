import Article from '../model';

export default function deleteByIds (ids) {
    return Article.deleteMany({ id: { $in: ids } });
}
