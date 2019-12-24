import request from 'superagent';
import base from './base';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function saveQuiz (quiz) {
    return () => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);
        console.log('saveQuiz', quiz);

        return base(
            request
                .post('/api/admin/quiz/save')
                .send(quiz)
                .query({ token })
        );
    };
}
