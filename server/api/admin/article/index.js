import express from 'express';

import verification from '../../../middlewares/verification';

import getArticles from './services/getArticles';
import saveArticle from './services/saveArticle';
import editArticle from './services/editArticle';
import deleteByIds from './services/deleteByIds';
import updateFiles from './services/updateFiles';
import updateAvatar from './services/updateAvatar';
import findArticleByName from './services/findArticleByName';

const router = express.Router();

router.use(verification('articles'));

router.route('/all')
    .get(getArticles);

router.route('/save')
    .post(saveArticle);

router.route('/edit')
    .post(editArticle);

router.route('/delete-few')
    .post(deleteByIds);

router.route('/update-files')
    .post(updateFiles);

router.route('/update-avatar')
    .post(updateAvatar);

router.route('/find')
    .get(findArticleByName);

export default router;
