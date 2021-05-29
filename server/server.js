import express from 'express';
import React from 'react';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import https from 'https';
import fs from 'fs';
import helmet from 'helmet';
import compression from 'compression';
import expressStaticGzip from 'express-static-gzip';
import { renderToString } from 'react-dom/server';
import { redirectToHTTPS } from 'express-http-to-https';

import map from '@tinkoff/utils/array/map';

import adminAuthenticationApi from './api/admin/admin';
import adminProductApi from './api/admin/product';
import clientProductApi from './api/client/product';
import adminArticleApi from './api/admin/article';
import clientArticleApi from './api/client/article';
import adminPartnerApi from './api/admin/partner';
import clientPartnerApi from './api/client/partner';
import adminFilesApi from './api/admin/files';
import adminCategoryApi from './api/admin/category';
import clientCategoryApi from './api/client/category';
import adminSubCategoryApi from './api/admin/subCategory';
import clientSubCategoryApi from './api/client/subCategory';
import adminReviewApi from './api/admin/review';
import clientReviewApi from './api/client/review';
import clientUserProductsApi from './api/client/userProducts';
import adminSeoApi from './api/admin/seo';
import clientSeoApi from './api/client/seo';
import adminMainSliderApi from './api/admin/mainSlider';
import clientMainSliderApi from './api/client/mainSlider';
import clientOrderApi from './api/client/order';
import adminOrderApi from './api/admin/order';
import clientSearchApi from './api/client/search';
import clientFormApi from './api/client/form';
import adminDbApi from './api/admin/db';

import backups from './helpers/backup/backups';

import { DATABASE_URL } from './constants/constants';
import actions from './actions';
import getStore from '../src/apps/client/store/getStore';
import renderAppPage from '../src/apps/client/html';
import renderAdminPage from '../src/apps/admin/html';

import verification from './helpers/verification';

import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import App from '../src/apps/client/App.jsx';

const credentials = {
    key: fs.readFileSync('server/https/private.key'),
    cert: fs.readFileSync('server/https/mebelmarket_ua.crt'),
    ca: [
        fs.readFileSync('server/https/AddTrust_External_CA_Root.crt'),
        fs.readFileSync('server/https/USERTrust_RSA_Certification_Authority.crt')
    ]
};

const ignoreHttpsHosts = [/localhost:(\d{4})/];

const rootPath = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = 443;
const app = express();

app.use(helmet());

// mongodb
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
backups();

// redirects
app.use(redirectToHTTPS(ignoreHttpsHosts, [], 301));

// static
app.get(/\.chunk\.(js|css)$/, expressStaticGzip(rootPath, {
    enableBrotli: true,
    orderPreference: ['br']
}));
app.use(compression());
app.use((req, res, next) => {
    const isCodeFiles = req.url.match(/(.js|.jsx|.json|.css)$/i);

    if (isCodeFiles) {
        return handleApp(req, res);
    }
    next();
});
app.use(express.static(rootPath));

// verification
app.use(verification);

// helpers
app.use(bodyParser.json());
app.use(cookieParser());

// api
app.use('/api/admin/authentication', adminAuthenticationApi);
app.use('/api/admin/product', adminProductApi);
app.use('/api/client/product', clientProductApi);
app.use('/api/admin/category', adminCategoryApi);
app.use('/api/client/category', clientCategoryApi);
app.use('/api/admin/subCategory', adminSubCategoryApi);
app.use('/api/client/subCategory', clientSubCategoryApi);
app.use('/api/client/search', clientSearchApi);
app.use('/api/admin/article', adminArticleApi);
app.use('/api/client/article', clientArticleApi);
app.use('/api/admin/partner', adminPartnerApi);
app.use('/api/client/partner', clientPartnerApi);
app.use('/api/admin/review', adminReviewApi);
app.use('/api/client/review', clientReviewApi);
app.use('/api/admin/files', adminFilesApi);
app.use('/api/client/user-products', clientUserProductsApi);
app.use('/api/admin/seo', adminSeoApi);
app.use('/api/client/seo', clientSeoApi);
app.use('/api/admin/main-slider', adminMainSliderApi);
app.use('/api/client/main-slider', clientMainSliderApi);
app.use('/api/client/order', clientOrderApi);
app.use('/api/admin/order', adminOrderApi);
app.use('/api/client/form', clientFormApi);
app.use('/api/admin/db', adminDbApi);

// admin
app.get(/^\/admin/, function (req, res) {
    const page = renderAdminPage();

    res.send(page);
});

// app
app.get('*', handleApp);

function handleApp (req, res) {
    const store = getStore();

    Promise.all(map(
        actionFunc => {
            return actionFunc(req, res)(store.dispatch);
        },
        actions
    ))
        .then(() => {
            const context = {};
            const html = renderToString(
                <Provider store={store}>
                    <StaticRouter
                        location={req.originalUrl}
                        context={context}
                    >
                        <App />
                    </StaticRouter>
                </Provider>
            );
            const helmet = Helmet.renderStatic();
            const preloadedState = store.getState();
            const page = renderAppPage(html, helmet, preloadedState);

            res.send(page);
        });
}

app.listen(PORT, function () {
    console.log('listening on port', PORT); // eslint-disable-line no-console
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(HTTPS_PORT);
