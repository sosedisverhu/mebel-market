import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllAdminsQuery from '../queries/getAllAdmins';

export default function getAllAdmins (req, res) {
    getAllAdminsQuery()
        .then(admin => {
            const newAdmin = admin.map(admin => {
                return {
                    login: admin.login,
                    email: admin.email,
                    sections: admin.sections,
                    id: admin.id
                };
            });
            res.status(OKEY_STATUS_CODE).send(newAdmin);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
