import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllAdmins from '../queries/getAllAdmins';
import deleteAdminByIdsQuery from '../queries/deleteAdminByIds';

export default function deleteAdmin (req, res) {
    const { ids } = req.body;

    deleteAdminByIdsQuery(ids)
        .then(() => {
            getAllAdmins()
                .then(admins => {
                    const editedAdmin = admins.map(admin => {
                        return {
                            login: admin.login,
                            email: admin.email,
                            id: admin.id,
                            sections: admin.sections
                        };
                    });
                    res.status(OKEY_STATUS_CODE).send(editedAdmin);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
