import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import editAdminQuery from '../queries/editAdmin';
import md5 from 'md5';

export default function editAdmin (req, res) {
    const { id, login, email, password, sections } = req.body;
    const admin = {
        id,
        login,
        email,
        sections,
        ...(password ? { password: md5(password) } : {})
    };

    editAdminQuery(admin)
        .then(oldValue => {
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
