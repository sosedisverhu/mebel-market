import request from 'superagent';
import base from '../base';

import setMainSlides from '../../actions/setMainSlides';

export default function getMainSlider (req) {
    return dispatch => {
        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/client/main-slider/slides`)
                .timeout({
                    deadline: 2000
                })
        )
            .then(slides => {
                dispatch(setMainSlides(slides));
            })
            .catch(() => {
                dispatch(setMainSlides([]));
            });
    };
}
