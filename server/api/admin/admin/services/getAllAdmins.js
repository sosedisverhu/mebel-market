import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllAdminsQuery from '../queries/getAllAdmins';

export default function getAllAdmins (req, res) {
    getAllAdminsQuery()
        .then(admin => {
            res.status(OKEY_STATUS_CODE).send(admin);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
