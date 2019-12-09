import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE, EDITOR_FILE_NAME_REGEX } from '../../../../constants/constants';

import multipart from '../../../../helpers/multipart';

const uploader = multipart(EDITOR_FILE_NAME_REGEX);

export default function updateAvatar (req, res) {
    uploader(req, res, (err) => {
        if (err) {
            return res.status(SERVER_ERROR_STATUS_CODE).end();
        }

        const files = req.files;
        const file = `/${files[0].path.replace(/\\/g, '/')}`;
        const host = req.get('host');

        res.status(OKEY_STATUS_CODE).send(`${req.protocol}://${host}${file}`);
    });
}
