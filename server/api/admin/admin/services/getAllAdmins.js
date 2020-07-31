import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllAdminsQuery from '../queries/getAllAdmins';

export default function getAllAdmins (req, res) {
    try {
        getAllAdminsQuery()
            .then(admins => {
                const editedAdmin = admins.map(admin => {
                    const { login, email, sections, id } = admin;
                    return {
                        login,
                        email,
                        sections,
                        id
                    };
                });
                res.status(OKEY_STATUS_CODE).send(editedAdmin);
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
