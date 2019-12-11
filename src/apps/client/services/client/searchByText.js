import request from 'superagent';
import base from '../base';

export default function searchByText (text) {
    return () => {
        console.log('text sBT', text);
        return base(
            request
                .get(`/api/client/search/`)
                .query({ text })
        );
    };
}
