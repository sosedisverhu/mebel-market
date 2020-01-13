import request from 'superagent';
import base from './base';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function updateQuizFiles (files, id) {
    return () => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);
        return base(
            request
                .post('/api/admin/quiz/update-files')
                .send(files)
                .query({ token, id })
        );
    };
}
