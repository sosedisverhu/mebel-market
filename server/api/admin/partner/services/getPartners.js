import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllPartners from '../../../client/partner/queries/getAllPartners';

export default function getPartners (req, res) {
    getAllPartners()
        .then(partners => {
            res.status(OKEY_STATUS_CODE).send(partners
                .sort((prev, next) => prev.positionIndex - next.positionIndex));
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
