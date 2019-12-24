import Quiz from '../model';

export default function saveQuiz (quiz) {
    return Quiz.create(quiz);
};
