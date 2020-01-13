import express from 'express';

import verification from '../../../middlewares/verification';

import getOrders from './services/getOrders';
import editOrder from './services/editOrder';

const router = express.Router();

router.use(verification);

router.route('/all')
    .get(getOrders);

router.route('/edit')
    .post(editOrder);

export default router;
