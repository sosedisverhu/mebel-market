import request from 'superagent';
import base from './base';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function updateCategoryImage (file, id) {
    return () => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .post('/api/admin/category/update-image')
                .send(file)
                .query({ token, id })
        );
    };
}
