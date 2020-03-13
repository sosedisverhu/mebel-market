import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareAdmin from '../utils/prepareAdmin';

import editAdminQuery from '../queries/editAdmin';

export default function editAdmin (req, res) {
    const admin = prepareAdmin(req.body);

    editAdminQuery(admin)
        .then(admin => {
            const editedAdmin = {
                email: admin.email,
                login: admin.login,
                sections: admin.sections
            };
            res.status(OKEY_STATUS_CODE).send(editedAdmin);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
