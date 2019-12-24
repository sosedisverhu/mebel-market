import fs from 'fs';
import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE, QUIZZES_ITEM_LOGO_FIELD_NAME_REGEX } from '../../../../constants/constants';

import editQuizQuery from '../../../client/quiz/queries/editQuiz';
import getQuizById from '../../../client/quiz/queries/getQuizById';

import multipart from '../../../../helpers/multipart';

import noop from '@tinkoff/utils/function/noop';

const uploader = multipart(QUIZZES_ITEM_LOGO_FIELD_NAME_REGEX);

export default function updateLogo (req, res) {
    const { id } = req.query;

    getQuizById(id)
        .then(([quiz]) => {
            uploader(req, res, (err) => {
                if (err) {
                    return res.status(SERVER_ERROR_STATUS_CODE).end();
                }

                quiz.logo && fs.unlink(quiz.logo.slice(1), noop);

                const files = req.files;
                const logo = `/${files[0].path.replace(/\\/g, '/')}`;

                editQuizQuery({ logo, id })
                    .then(quiz => {
                        res.status(OKEY_STATUS_CODE).send(quiz);
                    })
                    .catch(() => {
                        fs.unlink(logo.slice(1), noop);

                        return res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            });
        })
        .catch(() => {
            return res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
