import Quiz from '../model';

export default function getQuizById (id) {
    return Quiz.find({ id });
}
