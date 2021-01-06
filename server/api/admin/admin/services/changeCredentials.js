import md5 from 'md5';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAdminByLogin from '../queries/getAdminByLogin';
import changeCredentialsQuery from '../queries/changeCredentials';

export default function changeCredentials (req, res) {
    const { oldCredentials = {}, newCredentials = {} } = req.body;

    getAdminByLogin(oldCredentials.login)
        .then((admin) => {
            if (admin.password !== md5(oldCredentials.password)) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            changeCredentialsQuery({
                login: newCredentials.login,
                password: md5(newCredentials.password),
                email: newCredentials.email,
                id: admin.id
            })
                .then(() => {
                    res.status(OKEY_STATUS_CODE).end();
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        })
        .catch(() => {
            res.status(FORBIDDEN_STATUS_CODE).end();
        });
}
