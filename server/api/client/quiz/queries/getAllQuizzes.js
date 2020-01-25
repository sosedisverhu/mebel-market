import Quiz from '../model';

export default function getAllQuizzes () {
    return Quiz.find({});
}
