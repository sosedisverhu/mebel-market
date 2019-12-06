import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllCategories from '../../../client/productsCategory/queries/getAllCategories';

export default function getCategories (req, res) {
    getAllCategories()
        .then(categories => {
            const sortableCategories = categories
                .sort((oldCategory, newCategory) => oldCategory.positionIndex - newCategory.positionIndex);

            res.status(OKEY_STATUS_CODE).send(sortableCategories);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
