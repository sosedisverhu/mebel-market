import request from 'superagent';
import base from '../base';

export default function sendCustomSizeApplication (payload) {
    return () => {
        return base(
            request
                .post('/api/client/form/size-app')
                .send(payload)
        );
    };
}
