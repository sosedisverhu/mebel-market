import express from 'express';

import getAvailablePartner from './services/getAvailablePartner';
import getAvailablePartners from './services/getAvailablePartners';
import getAvailablePartnersByIds from './services/getAvailablePartnersByIds';
import availablePartnersSearch from './services/availablePartnersSearch';

const router = express.Router();

router.route('/')
    .get(getAvailablePartner);

router.route('/all')
    .get(getAvailablePartners);

router.route('/by-ids')
    .post(getAvailablePartnersByIds);

router.route('/search')
    .get(availablePartnersSearch);

export default router;
