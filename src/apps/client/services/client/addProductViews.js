import request from 'superagent';
import base from '../base';

export default function addProductViews (id) {
    return base(
        request
            .get('/api/client/product/views')
            .query({ id })
    );
}
