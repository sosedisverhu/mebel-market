import fs from 'fs';
import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE, QUIZ_OPTION_FILE_NAME_REGEX } from '../../../../constants/constants';

import editQuizQuery from '../../../client/quiz/queries/editQuiz';

import multipart from '../../../../helpers/multipart';

import noop from '@tinkoff/utils/function/noop';

const uploader = multipart(QUIZ_OPTION_FILE_NAME_REGEX);

export default function updateFiles (req, res) {
    uploader(req, res, (err) => {
        if (err) {
            return res.status(SERVER_ERROR_STATUS_CODE).end();
        }

        const filesPaths = [];
        const files = req.files;
        const { id } = req.query;
        const oldFiles = JSON.parse(req.body.oldFiles);
        const removedFiles = JSON.parse(req.body.removedFiles);
        const quiz = JSON.parse(req.body.quiz);
        const steps = quiz.steps;

        files.forEach(file => {
            filesPaths.push(`/${file.path.replace(/\\/g, '/')}`);
        });
        oldFiles.forEach((file) => {
            filesPaths[file.index] = file.path;
        });
        removedFiles.forEach(function (file) {
            fs.unlink(file.path.slice(1), noop);
        });

        for (let lang of Object.keys(steps)) {
            steps[lang].forEach((step) => {
                step.options.forEach((option, optionIndex) => {
                    filesPaths.forEach((filePath, filePathIndex) => {
                        if (filePath.includes(option.id)) {
                            step.options[optionIndex].file.files[0] = filesPaths[filePathIndex];
                        }
                    });
                });
            });
        }

        editQuizQuery({ steps: steps, id })
            .then(quiz => {
                res.status(OKEY_STATUS_CODE).send(quiz);
            })
            .catch(() => {
                filesPaths.forEach(function (filename) {
                    fs.unlink(filename.slice(1), noop);
                });

                return res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    });
}
