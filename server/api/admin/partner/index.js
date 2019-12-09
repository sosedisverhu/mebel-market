import express from 'express';

import verification from '../../../middlewares/verification';

import getPartners from './services/getPartners';
import savePartner from './services/savePartner';
import editPartner from './services/editPartner';
import deleteByIds from './services/deleteByIds';
import updateFiles from './services/updateFiles';
import updateAvatar from './services/updateAvatar';
import findPartnerByName from './services/findPartnerByName';

const router = express.Router();

router.use(verification);

router.route('/all')
    .get(getPartners);

router.route('/save')
    .post(savePartner);

router.route('/edit')
    .post(editPartner);

router.route('/delete-few')
    .post(deleteByIds);

router.route('/update-files')
    .post(updateFiles);

router.route('/update-avatar')
    .post(updateAvatar);

router.route('/find')
    .get(findPartnerByName);

export default router;
