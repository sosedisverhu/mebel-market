import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllSubCategories from '../queries/getAllSubCategories';

export default function getAvailableSubCategories (req, res) {
    getAllSubCategories()
        .then(subCategories => {
            const availableSubCategories = subCategories
                .filter(subCategory => !subCategory.hidden)
                .sort((prev, next) => next.date - prev.date);

            res.status(OKEY_STATUS_CODE).send(availableSubCategories);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
