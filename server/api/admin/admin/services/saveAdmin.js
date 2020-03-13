import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import addAdmin from '../queries/addAdmin';
import prepareAdmin from '../utils/prepareAdmin';

export default function saveAdmin (req, res) {
    const admin = prepareAdmin(req.body);
    const id = uniqid();

    addAdmin({ ...admin, id })
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
