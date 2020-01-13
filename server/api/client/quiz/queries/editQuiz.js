import Quiz from '../model';

export default function editQuiz (quizItem) {
    return Quiz.findOneAndUpdate({ id: quizItem.id }, quizItem, { new: true });
}
