import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import findSubCategoriesByName from '../queries/findSubCategoriesByName';

export default function availableSubCategoriesSearch (req, res) {
    const { text } = req.query;

    findSubCategoriesByName(text)
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
