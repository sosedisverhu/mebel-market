import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import findNewsByNameQuery from '../../../client/newsItem/queries/findNewsByName';

export default function findNewsItemByName (req, res) {
    const { text } = req.query;

    findNewsByNameQuery(text)
        .then(news => {
            res.status(OKEY_STATUS_CODE).send(news);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
