import request from 'superagent';
import base from '../base';

export default function saveOrder (order) {
    return () => {
        return base(
            request
                .post(`/api/client/order/new`)
                .send(order)
        );
    };
}
