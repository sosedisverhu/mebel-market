import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE } from '../../../../constants/constants';
import getAdminByEmail from '../queries/getAdminByEmail';

const publicKey = fs.readFileSync(path.resolve(__dirname, 'privateKeys/adminPublicKey.ppk'), 'utf8');

export default function checkRecoveryToken (req, res) {
    const { token, email } = req.query;

    if (!token || !email) {
        return res.status(FORBIDDEN_STATUS_CODE).end();
    }

    getAdminByEmail(email)
        .then((admin) => {
            if (!admin) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            jsonwebtoken.verify(token, publicKey, {
                algorithm: 'RS256'
            }, err => {
                if (err) {
                    return res.status(FORBIDDEN_STATUS_CODE).end();
                }

                res.status(OKEY_STATUS_CODE).end();
            });
        })
        .catch(() => {
            res.status(FORBIDDEN_STATUS_CODE).end();
        });
}
