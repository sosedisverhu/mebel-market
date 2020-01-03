import fs from 'fs';
import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE, CATEGORIES_ITEM_IMAGE_FIELD_NAME_REGEX } from '../../../../constants/constants';

import editCategoryQuery from '../../../client/category/queries/editCategory';
import getCategoryById from '../../../client/category/queries/getCategoryById';

import multipart from '../../../../helpers/multipart';

import noop from '@tinkoff/utils/function/noop';

const uploader = multipart(CATEGORIES_ITEM_IMAGE_FIELD_NAME_REGEX);

export default function updateImage (req, res) {
    const { id } = req.query;

    getCategoryById(id)
        .then(([category]) => {
            uploader(req, res, (err) => {
                if (err) {
                    return res.status(SERVER_ERROR_STATUS_CODE).end();
                }

                category.image && fs.unlink(category.image.slice(1), noop);

                const files = req.files;
                const image = `/${files[0].path.replace(/\\/g, '/')}`;

                editCategoryQuery({ image, id })
                    .then(category => {
                        res.status(OKEY_STATUS_CODE).send(category);
                    })
                    .catch(() => {
                        fs.unlink(image.slice(1), noop);

                        return res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            });
        })
        .catch(() => {
            return res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
