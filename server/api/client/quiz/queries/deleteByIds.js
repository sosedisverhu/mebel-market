import Quiz from '../model';

export default function deleteByIds (ids) {
    return Quiz.deleteMany({ id: { $in: ids } });
}
