import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareNewsItem from '../utils/prepareNewsItem';

import saveNewsItemQuery from '../../../client/newsItem/queries/saveNewsItem';

export default function saveNewsItem (req, res) {
    const newsItem = prepareNewsItem(req.body);
    const id = uniqid();
    const date = Date.now();

    saveNewsItemQuery({ ...newsItem, date, id })
        .then(newsItem => {
            res.status(OKEY_STATUS_CODE).send(newsItem);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
