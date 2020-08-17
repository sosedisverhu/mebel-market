import request from 'superagent';
import base from '../base';

export default function sendCallApplication (payload) {
    return () => {
        return base(
            request
                .post('/api/client/form/call-app')
                .send(payload)
        );
    };
}
