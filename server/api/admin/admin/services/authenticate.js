import jsonwebtoken from 'jsonwebtoken';
import md5 from 'md5';
import fs from 'fs';
import path from 'path';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import getAdminByLogin from '../queries/getAdminByLogin';
import changeCredentials from '../queries/changeCredentials';

const privateKey = fs.readFileSync(path.resolve(__dirname, 'privateKeys/adminPrivateKey.ppk'), 'utf8');

export default function authenticate (req, res) {
    const { login, password } = req.body;

    getAdminByLogin(login)
        .then((admin) => {
            if (!admin) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            if (admin.password !== md5(password)) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            jsonwebtoken.sign(admin.toJSON(), privateKey, {
                algorithm: 'RS256',
                expiresIn: '24h'
            }, (err, token) => {
                if (err || !token) {
                    return res.status(SERVER_ERROR_STATUS_CODE).end();
                }

                changeCredentials({
                    id: admin.id,
                    isMain: true,
                    sections: ['orders', 'main', 'products', 'articles', 'reviews', 'partners', 'seo', 'admins', 'credentials']
                })
                    .then(() => {
                        res.status(OKEY_STATUS_CODE).json({
                            token: token,
                            user: {
                                email: admin.email,
                                login: admin.login,
                                sections: admin.sections
                            }
                        });
                    })
                    .catch((err) => {
                        res.status(OKEY_STATUS_CODE).send(err);
                    })
            });
        })
        .catch(() => {
            res.status(FORBIDDEN_STATUS_CODE).end();
        });
}
