import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import getRecoveryEmailTemplate from '../templates/recoveryEmail';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import getAdminByEmail from '../queries/getAdminByEmail';
import sendRecoveryEmail from '../queries/sendRecoveryEmail';

const privateKey = fs.readFileSync(path.resolve(__dirname, 'privateKeys/adminPrivateKey.ppk'), 'utf8');

export default function recover (req, res) {
    const email = req.query.email;

    getAdminByEmail(email)
        .then(admin => {
            if (!admin) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            jsonwebtoken.sign(admin.toJSON(), privateKey, {
                algorithm: 'RS256',
                expiresIn: '24h'
            }, (err, token) => {
                if (err || !token) {
                    return res.status(SERVER_ERROR_STATUS_CODE).end();
                }

                const subject = 'Восстановление учетной записи';
                const host = req.get('host');
                const recoveryUrl = `${req.protocol}://${host}/admin/recovery?recovery-token=${token}&&email=${admin.email}`;
                const successCallback = () => res.sendStatus(OKEY_STATUS_CODE);
                const failureCallback = () => res.sendStatus(SERVER_ERROR_STATUS_CODE);

                sendRecoveryEmail(admin.email, subject, getRecoveryEmailTemplate(recoveryUrl), successCallback, failureCallback);
            });
        })
        .catch(() => {
            res.status(FORBIDDEN_STATUS_CODE).end();
        });
}
