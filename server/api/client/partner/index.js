import express from 'express';

import getAvailablePartner from './services/getAvailablePartner';
import getAvailablePartners from './services/getAvailablePartners';
import getAvailablePartnersByIds from './services/getAvailablePartnersByIds';

const router = express.Router();

router.route('/')
    .get(getAvailablePartner);

router.route('/all')
    .get(getAvailablePartners);

router.route('/by-ids')
    .post(getAvailablePartnersByIds);

export default router;
