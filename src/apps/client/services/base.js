export default function base (request) {
    return new Promise((resolve, reject) => {
        request
            .end((err, res) => {
                if (err) {
                    return reject(err);
                }

                resolve(res.body || res.text);
            });
    });
}
