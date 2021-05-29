import express from 'express';

import saveApplication from './services/saveApplication';
import saveApplicationSize from './services/saveApplicationSize';

const router = express.Router();

router.route('/call-app')
    .post(saveApplication);

router.route('/size-app')
    .post(saveApplicationSize);

export default router;
