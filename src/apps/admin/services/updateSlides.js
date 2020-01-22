import request from 'superagent';
import base from './base';

import setMainSlides from '../actions/setMainSlides';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function updateSlides (data) {
    const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

    return dispatch => base(
        request
            .post('/api/admin/main-slider/update-slides')
            .query({ token })
            .send(data)
    )
        .then(slides => {
            return dispatch(setMainSlides(slides));
        });
}
