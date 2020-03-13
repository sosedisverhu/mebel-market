import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import checkAuthentication from './services/checkAuthentication';

import { Switch, Route, withRouter } from 'react-router-dom';
import { matchPath } from 'react-router';

import ProductsPage from './ui/pages/ProductsPage/ProductsPage.jsx';
import CategoriesPage from './ui/pages/CategoriesPage/CategoriesPage';
import ArticlesPage from './ui/pages/ArticlesPage/ArticlesPage.jsx';
import PartnersPage from './ui/pages/PartnersPage/PartnersPage.jsx';
import Header from './ui/components/Header/Header.jsx';
import Authentication from './ui/components/Authentication/Authentication.jsx';
import Recovery from './ui/components/Recovery/Recovery.jsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import SeoPage from './ui/pages/SeoPage/SeoPage.jsx';
import AdminPage from './ui/pages/AdminPage/AdminPage.jsx';

import MainSliderPage from './ui/pages/MainSliderPage/MainSliderPage';
import OrdersPage from './ui/pages/OrdersPage/OrdersPage.jsx';

import isNull from '@tinkoff/utils/is/nil';
import includes from '@tinkoff/utils/array/includes';
import propOr from '@tinkoff/utils/object/propOr';

import '../../../client/vendor';
import '../../css/main.css';

import styles from './App.css';

const RECOVERY_URL = '/admin/recovery';

const mapStateToProps = ({ application }) => {
    return {
        admin: application.admin
    };
};

const mapDispatchToProps = (dispatch) => ({
    checkAuthentication: payload => dispatch(checkAuthentication(payload))
});

class App extends Component {
    static propTypes = {
        checkAuthentication: PropTypes.func.isRequired,
        authenticated: PropTypes.object,
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
                {includes('main', sections) && <Route exact path='/admin' component={MainSliderPage} />}
                {includes('products', sections) && <Route exact path='/admin/products' component={ProductsPage} />}
                {includes('articles', sections) && <Route exact path='/admin/articles' component={ArticlesPage} />}
                {includes('products', sections) && <Route exact path='/admin/categories' component={CategoriesPage} />}
                {includes('partners', sections) && <Route exact path='/admin/partners' component={PartnersPage} />}
                {includes('seo', sections) && <Route exact path='/admin/seo' component={SeoPage} />}
                {includes('admins', sections) && <Route exact path='/admin/admins' component={AdminPage} />}
                {includes('products', sections) && <Route exact path='/admin/orders' component={OrdersPage} />}
            </Switch>
        </main>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
