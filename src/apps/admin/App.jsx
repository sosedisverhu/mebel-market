import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import { matchPath } from 'react-router';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';

import isNull from '@tinkoff/utils/is/nil';
import includes from '@tinkoff/utils/array/includes';
import propOr from '@tinkoff/utils/object/propOr';

import checkAuthentication from './services/checkAuthentication';

import ProductsPage from './ui/pages/ProductsPage/ProductsPage.jsx';
import ArticlesPage from './ui/pages/ArticlesPage/ArticlesPage.jsx';
import PartnersPage from './ui/pages/PartnersPage/PartnersPage.jsx';
import ReviewsPage from './ui/pages/ReviewsPage/ReviewsPage';
import Header from './ui/components/Header/Header.jsx';
import Authentication from './ui/components/Authentication/Authentication.jsx';
import Recovery from './ui/components/Recovery/Recovery.jsx';
import SeoPage from './ui/pages/SeoPage/SeoPage.jsx';
import MainSliderPage from './ui/pages/MainSliderPage/MainSliderPage';
import OrdersPage from './ui/pages/OrdersPage/OrdersPage.jsx';
import CredentialsPage from './ui/pages/CredentialsPage/CredentialsPage.jsx';
import AdminPage from './ui/pages/AdminPage/AdminPage.jsx';
import DatabasePage from './ui/pages/DatabasePage/DatabasePage.jsx';

import '../../../client/vendor';
import '../../css/main.css';

import styles from './App.css';

const RECOVERY_URL = '/admin/recovery';

const mapStateToProps = ({ application }) => {
    return {
        admin: application.admin
    };
};

const mapDispatchToProps = dispatch => ({
    checkAuthentication: payload => dispatch(checkAuthentication(payload))
});

class App extends Component {
    static propTypes = {
        checkAuthentication: PropTypes.func.isRequired,
        location: PropTypes.object,
        admin: PropTypes.object
    };

    static defaultProps = {
        location: {}
    };

    constructor (...args) {
        super(...args);

        const { location: { pathname } } = this.props;

        this.isRecovery = matchPath(pathname, RECOVERY_URL);
    }

    componentDidMount () {
        this.props.checkAuthentication();
    }

    render () {
        const { admin } = this.props;
        const sections = propOr('sections', [], admin);

        if (this.isRecovery) {
            return <Recovery />;
        }

        if (isNull(admin)) {
            return <div className={styles.loader}>
                <CircularProgress />
            </div>;
        }

        if (!admin) {
            return <Authentication />;
        }

        return <main>
            <Header />
            <Switch>
                {includes('orders', sections) && <Route exact path='/admin' component={OrdersPage}/>}
                {includes('products', sections) && <Route exact path='/admin/products' component={ProductsPage}/>}
                {includes('articles', sections) && <Route exact path='/admin/articles' component={ArticlesPage}/>}
                {includes('main', sections) && <Route exact path='/admin/slider' component={MainSliderPage}/>}
                {includes('partners', sections) && <Route exact path='/admin/partners' component={PartnersPage}/>}
                {includes('reviews', sections) && <Route exact path='/admin/reviews' component={ReviewsPage}/>}
                {includes('seo', sections) && <Route exact path='/admin/seo' component={SeoPage}/>}
                {includes('admins', sections) && <Route exact path='/admin/admins' component={AdminPage}/>}
                {includes('credentials', sections) && <Route exact path='/admin/credentials' component={CredentialsPage}/>}
                <Route exact path='/admin/db' component={DatabasePage} />
            </Switch>
        </main>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
