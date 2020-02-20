import request from 'superagent';
import base from '../base';

export default function saveReview (review) {
    return () => {
        return base(
            request
                .post(`/api/client/review/new`)
                .send(review)
        );
    };
}
