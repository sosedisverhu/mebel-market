import request from 'superagent';
import base from '../base';

import { COOKIE_BASKET_ID, COOKIE_YEARS } from '../../constants/constants';

import setBasket from '../../actions/setBasket';

export default function getBasket (req, res) {
    return dispatch => {
        const host = req.get('host');
        const id = req.cookies[COOKIE_BASKET_ID];

        return base(
            request
                .get(`${host}/api/client/basket/`)
                .query({ id })
                .timeout({
                    deadline: 2000
                })
        )
            .then(({ id, basket }) => {
                const expires = new Date();

                expires.setFullYear(expires.getFullYear() + COOKIE_YEARS);
                res.cookie(COOKIE_BASKET_ID, id, { expires });

                dispatch(setBasket(basket));
            })
            .catch(() => {
                dispatch(setBasket([]));
            });
    };
}
