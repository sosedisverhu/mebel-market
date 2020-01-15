import request from 'superagent';
import base from './base';

import setMainSlides from '../actions/setMainSlides';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getMainSlides () {
    const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

    return dispatch => base(
        request
            .get('/api/client/main-slider/slides')
            .query({ token })
    )
        .then(slides => {
            return dispatch(setMainSlides(slides));
        });
}
