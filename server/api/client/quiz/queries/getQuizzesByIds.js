import Quiz from '../model';

export default function getQuizzesByIds (ids) {
    return Quiz.find({ id: { $in: ids } });
}
