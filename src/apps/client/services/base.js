import pathOr from '@tinkoff/utils/object/pathOr';

export default function base (request) {
    return new Promise((resolve, reject) => {
        request
            .end((err, res) => {
                if (err) {
                    return reject(pathOr(['response', 'body'], {}, err));
                }

                resolve(res.body || res.text);
            });
    });
}
