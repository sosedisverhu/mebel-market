import express from 'express';

import verification from '../../../middlewares/verification';

import getPartners from './services/getPartners';
import savePartner from './services/savePartner';
import editPartner from './services/editPartner';
import deleteByIds from './services/deleteByIds';
import updateLogo from './services/updateLogo';
import findPartnerByName from './services/findPartnerByName';
import editPositions from './services/editPartnersPositions';

const router = express.Router();

router.use(verification('partners'));

router.route('/all')
    .get(getPartners);

router.route('/save')
    .post(savePartner);

router.route('/edit')
    .post(editPartner);

router.route('/delete-few')
    .post(deleteByIds);

router.route('/update-logo')
    .post(updateLogo);

router.route('/find')
    .get(findPartnerByName);

router.route('/edit-positions')
    .post(editPositions);

export default router;
