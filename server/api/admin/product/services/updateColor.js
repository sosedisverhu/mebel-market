import fs from 'fs';
import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE, PRODUCT_COLOR_FIELD_NAME_REGEX } from '../../../../constants/constants';

import editProductQuery from '../../../client/product/queries/editProduct';
import getProductById from '../../../client/product/queries/getProductById';

import multipart from '../../../../helpers/multipart';

import noop from '@tinkoff/utils/function/noop';

const uploader = multipart(PRODUCT_COLOR_FIELD_NAME_REGEX);

export default function updateColor (req, res) {
    const { id } = req.query;

    getProductById(id)
        .then(([product]) => {
            uploader(req, res, (err) => {
                if (err) {
                    return res.status(SERVER_ERROR_STATUS_CODE).end();
                }

                const files = req.files;
                const filesPaths = [];

                files.forEach(file => {
                    filesPaths.push(`/${file.path.replace(/\\/g, '/')}`);
                });

                for (var lang in product.sizes) {
                    product.sizes[lang].forEach(size => {
                        size.colors.forEach((color, colorIndex) => {
                            filesPaths.forEach((filePath, filePathIndex) => {
                                if (filePath.includes(size.id) && filePath.includes(color.id)) {
                                    size.colors[colorIndex].file &&
                                    typeof size.colors[colorIndex].file === 'string' &&
                                    fs.unlink(size.colors[colorIndex].file.slice(1), noop);
                                    size.colors[colorIndex].file = filesPaths[filePathIndex];
                                }
                            });
                        });
                    });
                }

                editProductQuery({ sizes: product.sizes, id })
                    .then(product => {
                        res.status(OKEY_STATUS_CODE).send(product);
                    })
                    .catch(() => {
                        filesPaths.forEach(function (filename) {
                            fs.unlink(filename.slice(1), noop);
                        });

                        return res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            });
        })
        .catch(() => {
            return res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
