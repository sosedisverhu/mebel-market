import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import findArticlesByNameQuery from '../../../client/article/queries/findArticlesByName';

export default function findArticleByName (req, res) {
    const { text } = req.query;

    findArticlesByNameQuery(text)
        .then(articles => {
            res.status(OKEY_STATUS_CODE).send(articles);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
