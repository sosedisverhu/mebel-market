import express from 'express';

import verification from '../../../middlewares/verification';

import getNews from './services/getNews';
import saveNewsItem from './services/saveNewsItem';
import editNewsItem from './services/editNewsItem';
import deleteByIds from './services/deleteByIds';
import updateFiles from './services/updateFiles';
import updateAvatar from './services/updateAvatar';
import findNewsItemByName from './services/findNewsItemByName';

const router = express.Router();

router.use(verification);

router.route('/all')
    .get(getNews);

router.route('/save')
    .post(saveNewsItem);

router.route('/edit')
    .post(editNewsItem);

router.route('/delete-few')
    .post(deleteByIds);

router.route('/update-files')
    .post(updateFiles);

router.route('/update-avatar')
    .post(updateAvatar);

router.route('/find')
    .get(findNewsItemByName);

export default router;
