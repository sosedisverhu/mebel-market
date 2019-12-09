import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getCategoriesByIds from '../queries/getCategoriesByIds';

export default function getAvailableCategoriesByIds (req, res) {
    const ids = req.body;

    getCategoriesByIds(ids)
        .then(categories => {
            const availableCategories = categories
                .filter(category => !category.hidden);

            res.status(OKEY_STATUS_CODE).send(availableCategories);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
