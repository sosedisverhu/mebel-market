import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE } from '../../../../constants/constants';

const publicKey = fs.readFileSync(path.resolve(__dirname, 'privateKeys/adminPublicKey.ppk'), 'utf8');

export default function checkAuthentication (req, res) {
    const token = req.query.token;

    if (!token) {
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
}
