import express from 'express';

import saveOrder from './services/saveOrder';

const router = express.Router();

router.route('/new')
    .post(saveOrder);

export default router;
