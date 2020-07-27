import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import { FORBIDDEN_STATUS_CODE } from '../constants/constants';

import getAdminByEmail from '../api/admin/admin/queries/getAdminByEmail';

const publicKey = fs.readFileSync(path.resolve(__dirname, 'privateKeys/adminPublicKey.ppk'), 'utf8');

const verification = name => (req, res, next) => {
    const { token } = req.query;

    if (token) {
        jsonwebtoken.verify(token, publicKey, {
            algorithm: 'RS256'
        }, (err, admin) => {
            if (err || !admin) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            getAdminByEmail(admin.email)
                .then(admin => {
                    if (!admin || admin.sections.indexOf(name) === -1 && name !== '*') {
                        return res.status(FORBIDDEN_STATUS_CODE).end();
                    }

                    next();
                });
        });
    } else {
        return res.status(FORBIDDEN_STATUS_CODE).end();
    }
}

export default verification;
