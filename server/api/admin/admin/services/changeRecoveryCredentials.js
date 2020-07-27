import jsonwebtoken from 'jsonwebtoken';
import md5 from 'md5';
import fs from 'fs';
import path from 'path';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAdminByEmail from '../queries/getAdminByEmail';
import changeCredentialsQuery from '../queries/changeCredentials';

const publicKey = fs.readFileSync(path.resolve(__dirname, 'privateKeys/adminPublicKey.ppk'), 'utf8');

export default function changeRecoveryCredentials (req, res) {
    const { recovery = {}, newCredentials = {} } = req.body;

    getAdminByEmail(recovery.email)
        .then((admin) => {
            if (!admin) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            jsonwebtoken.verify(recovery.token, publicKey, {
                algorithm: 'RS256'
            }, err => {
                if (err) {
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
            });
        })
        .catch(() => {
            res.status(FORBIDDEN_STATUS_CODE).end();
        });
}
