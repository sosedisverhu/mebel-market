import express from 'express';

import verification from '../../../middlewares/verification';

import download from './services/download';
import downloadFiles from './services/downloadFiles';
import upload from './services/upload';
import uploadFiles from './services/uploadFiles';

const router = express.Router();

router.use(verification('products'));

router.route('/download')
    .get(download);

router.route('/download/files')
    .get(downloadFiles);

router.route('/upload')
    .post(upload);

router.route('/upload/files')
    .post(uploadFiles);

export default router;
