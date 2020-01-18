import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import '../../../client/vendor';
import '../../css/main.css';

import media from './ui/hocs/media/media.jsx';
import lang from './ui/hocs/lang/lang.jsx';

import { connect } from 'react-redux';

import Header from './ui/components/Header/Header.jsx';
import MainPage from './ui/pages/MainPage/MainPage.jsx';
import CheckoutPage from './ui/pages/CheckoutPage/CheckoutPage.jsx';
import ProductPage from './ui/pages/ProductPage/ProductPage.jsx';
import ProductsPage from './ui/pages/ProductsPage/ProductsPage.jsx';
import Footer from './ui/components/Footer/Footer.jsx';
import NotFoundPage from './ui/pages/NotFoundPage/NotFoundPage.jsx';
import DeliveryAndPayment from './ui/pages/DeliveryAndPayment/DeliveryAndPayment.jsx';
import Partners from './ui/pages/Partners/Partners.jsx';
import Articles from './ui/pages/Articles/Articles.jsx';
import ArticlePage from './ui/pages/ArticlePage/ArticlePage.jsx';
import Contacts from './ui/pages/Contacts/Contacts.jsx';
import SearchPage from './ui/pages/SearchPage/SearchPage.jsx';
import Helmet from './ui/components/Helmet/Helmet.jsx';

import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import getLangRouteParts from './utils/getLangRouteParts';
import getLangFromRoute from './utils/getLangFromRoute';
import isScrolledIntoView from './utils/isScrolledIntoView';

import { LANGS } from './constants/constants';

import styles from './App.css';

const langs = LANGS
    .slice(1)
    .join('|');

const mapStateToProps = ({ application }) => {
    return {
        lang: application.lang,
        langRoute: application.langRoute
    };
};

@lang
@media
class App extends Component {
    static propTypes = {
        lang: PropTypes.string,
        langRoute: PropTypes.string,
        location: PropTypes.object
    };

    static defaultProps = {
        langRoute: ''
    };

    pageRef = React.createRef();
    pageContentRef = React.createRef();

    state = {
        onLoadAnimation: false,
        pageContentAnimation: false
    }

    componentDidMount () {
        this.setState({ onLoadAnimation: true });

        if (document.readyState === 'complete') {
            this.handleScroll();
            document.addEventListener('scroll', this.handleScroll);
        } else {
            window.addEventListener('load', () => {
                this.handleScroll();
                document.addEventListener('scroll', this.handleScroll);
            });
        }
    }

    componentWillUnmount () {
        document.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        this.isScrolledIntoView(this.pageContentRef.current, 'pageContentAnimation');
    };

    isScrolledIntoView = (elem, stateName) => {
        if (this.state[stateName]) {
            return;
        }

        const isVisible = isScrolledIntoView(elem);

        if (isVisible) {
            this.setState({ [stateName]: true });
        }
    };

    runPageContentAnimation = () => {
        this.setState({ pageContentAnimation: false }, () => {
            setTimeout(() => this.setState({ pageContentAnimation: true }), 0);
        });
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.location !== nextProps.location) {
            window.scrollTo(0, 0);
            this.runPageContentAnimation();
        }
    };

    renderComponent = Component => ({ location: { pathname } }) => {
        if (typeof window === 'undefined') {
            return <Component />;
        }

        const { lang, langRoute } = this.props;
        const langUrl = getLangFromRoute(pathname);
        const { routeWithoutLang } = getLangRouteParts(pathname);

        return lang === langUrl ? <Component /> : <Redirect to={`${langRoute}${routeWithoutLang}`} />;
    };

    render () {
        const { onLoadAnimation, pageContentAnimation } = this.state;
        return <main>
            <div ref={this.pageRef}
                className={classNames(styles.page, {
                    [styles.fadeIn]: onLoadAnimation,
                    [styles.pageVisible]: onLoadAnimation
                })}>
                <Helmet />
                <Header />
                <div ref={this.pageContentRef}
                    className={classNames(styles.pageContent, {
                        [styles.fadeIn]: pageContentAnimation,
                        [styles.pageContentVisible]: pageContentAnimation
                    })}>
                    <Switch>
                        <Route exact path={`/:lang(${langs})?`} render={this.renderComponent(MainPage)} />
                        <Route exact path={`/:lang(${langs})?/order`} render={this.renderComponent(CheckoutPage)} />
                        <Route exact path={`/:lang(${langs})?/delivery-and-payment`} render={this.renderComponent(DeliveryAndPayment)} />
                        <Route exact path={`/:lang(${langs})?/partners`} render={this.renderComponent(Partners)} />
                        <Route exact path={`/:lang(${langs})?/search`} render={this.renderComponent(SearchPage)} />
                        <Route exact path={`/:lang(${langs})?/articles`} render={this.renderComponent(Articles)} />
                        <Route exact path={`/:lang(${langs})?/articles/:alias`} render={this.renderComponent(ArticlePage)} />
                        <Route exact path={`/:lang(${langs})?/contacts`} render={this.renderComponent(Contacts)} />
                        <Route exact path={`/:lang(${langs})?/:categoryAlias`} render={this.renderComponent(ProductsPage)} />
                        <Route exact path={`/:lang(${langs})?/:categoryAlias/:subCategoryAlias`} render={this.renderComponent(ProductsPage)} />
                        <Route exact path={`/:lang(${langs})?/:categoryAlias/:subCategoryAlias/:alias`} render={this.renderComponent(ProductPage)} />
                        <Route render={this.renderComponent(NotFoundPage)} />
                    </Switch>
                </div>
                <Footer />
            </div>
        </main>;
    }
}

export default withRouter(connect(mapStateToProps)(App));
