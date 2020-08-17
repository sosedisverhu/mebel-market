import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import addAdmin from '../queries/addAdmin';

import md5 from 'md5';

export default function saveAdmin (req, res) {
    try {
        const { login, email, password, sections } = req.body;
        const admin = {
            login,
            email,
            password: md5(password),
            sections
        };
        const id = uniqid();

        addAdmin({ ...admin, id })
            .then(admin => {
                const { email, login, sections } = admin;
                const editedAdmin = {
                    email,
                    login,
                    sections
                };

                res.status(OKEY_STATUS_CODE).send(editedAdmin);
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
