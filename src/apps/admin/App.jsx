import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import checkAuthentication from './services/checkAuthentication';

import { Switch, Route, withRouter } from 'react-router-dom';
import { matchPath } from 'react-router';

import MainPage from './ui/pages/MainPage/MainPage.jsx';
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

import isNull from '@tinkoff/utils/is/nil';

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
                {admin.sections.includes('main') && <Route exact path='/admin' component={MainPage} />}
                {admin.sections.includes('products') && <Route exact path='/admin/products' component={ProductsPage} />}
                {admin.sections.includes('articles') && <Route exact path='/admin/articles' component={ArticlesPage} />}
                {admin.sections.includes('products') && <Route exact path='/admin/categories' component={CategoriesPage} />}
                {admin.sections.includes('partners') && <Route exact path='/admin/partners' component={PartnersPage} />}
                {admin.sections.includes('seo') && <Route exact path='/admin/seo' component={SeoPage} />}
                {admin.sections.includes('admins') && <Route exact path='/admin/admins' component={AdminPage} />}
            </Switch>
        </main>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
