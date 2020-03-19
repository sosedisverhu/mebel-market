import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllPartners from '../queries/getAllPartners';

export default function getAvailablePartners (req, res) {
    getAllPartners()
        .then(partners => {
            const availablePartners = partners
                .filter(partner => !partner.hidden)
                .sort((prev, next) => prev.positionIndex - next.positionIndex);

            res.status(OKEY_STATUS_CODE).send(availablePartners);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
