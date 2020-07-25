import express from 'express';

import saveApplication from './services/saveApplication';

const router = express.Router();

router.route('/call-app')
    .post(saveApplication);

export default router;
