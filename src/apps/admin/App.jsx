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
import MainSliderPage from './ui/pages/MainSliderPage/MainSliderPage';

import isNull from '@tinkoff/utils/is/nil';

import '../../../client/vendor';
import '../../css/main.css';

import styles from './App.css';

const RECOVERY_URL = '/admin/recovery';

const mapStateToProps = ({ application }) => {
    return {
        authenticated: application.authenticated
    };
};

const mapDispatchToProps = (dispatch) => ({
    checkAuthentication: payload => dispatch(checkAuthentication(payload))
});

class App extends Component {
    static propTypes = {
        checkAuthentication: PropTypes.func.isRequired,
        authenticated: PropTypes.bool,
        location: PropTypes.object
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
        const { authenticated } = this.props;

        if (this.isRecovery) {
            return <Recovery />;
        }

        if (isNull(authenticated)) {
            return <div className={styles.loader}>
                <CircularProgress />
            </div>;
        }

        if (!authenticated) {
            return <Authentication />;
        }

        return <main>
            <Header />
            <Switch>
                <Route exact path='/admin' component={MainPage} />
                <Route exact path='/admin/mainSlider' component={MainSliderPage} />
                <Route exact path='/admin/products' component={ProductsPage} />
                <Route exact path='/admin/articles' component={ArticlesPage} />
                <Route exact path='/admin/categories' component={CategoriesPage} />
                <Route exact path='/admin/partners' component={PartnersPage} />
                <Route exact path='/admin/seo' component={SeoPage} />
            </Switch>
        </main>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
