import Review from '../model';

export default function deleteByIds (ids) {
    return Review.deleteMany({ id: { $in: ids } });
}
