import request from 'superagent';
import base from '../base';

import setPartners from '../../actions/setPartners';

export default function getPartners (req) {
    return dispatch => {
        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/client/partner/all`)
                .timeout({
                    deadline: 2000
                })
        )
            .then(partners => {
                dispatch(setPartners(partners));
            })
            .catch(() => {
                return dispatch(setPartners([]));
            });
    };
}
