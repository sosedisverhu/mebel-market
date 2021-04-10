import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import '../../../client/vendor';
import '../../css/main.css';

import media from './ui/hocs/media/media.jsx';
import lang from './ui/hocs/lang/lang.jsx';

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
import PromotionsPage from './ui/pages/PromotionsPage/PromotionsPage.jsx';
import CallbackCall from './ui/components/CallbackCall/CallbackCall';

import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import getLangRouteParts from './utils/getLangRouteParts';
import getLangFromRoute from './utils/getLangFromRoute';

import setAllShares from './actions/setAllShares';

import { LANGS, DEFAULT_LANG } from './constants/constants';

import styles from './App.css';

const langs = LANGS
    .slice(1)
    .join('|');

const mapStateToProps = ({ application, data }) => {
    return {
        lang: application.lang,
        langRoute: application.langRoute,
        products: data.products
    };
};

const mapDispatchToProps = (dispatch) => ({
    setAllShares: payload => dispatch(setAllShares(payload))
});

@lang
@media
class App extends Component {
    static propTypes = {
        lang: PropTypes.string,
        langRoute: PropTypes.string,
        location: PropTypes.object,
        products: PropTypes.array,
        setAllShares: PropTypes.func.isRequired
    };

    static defaultProps = {
        langRoute: ''
    };

    componentDidMount () {
        const allShares = this.props.products.reduce((arr, product) => {
            product.sizes[DEFAULT_LANG].map((size) => {
                if (size.shares) {
                    return size.shares.map((share) => { arr.push({ share, product }); });
                }
            });
            return arr;
        }, []);

        this.props.setAllShares(allShares);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.location !== nextProps.location) {
            window.scrollTo(0, 0);
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
        return <main>
            <div className={styles.page}>
                <Helmet />
                <Header/>
                <div className={styles.pageContent}>
                    <Switch>
                        <Route exact path={`/:lang(${langs})?`} render={this.renderComponent(MainPage)} />
                        <Route exact path={`/:lang(${langs})?/order`} render={this.renderComponent(CheckoutPage)} />
                        <Route exact path={`/:lang(${langs})?/delivery-and-payment`} render={this.renderComponent(DeliveryAndPayment)}/>
                        <Route exact path={`/:lang(${langs})?/partners`} render={this.renderComponent(Partners)} />
                        <Route exact path={`/:lang(${langs})?/search`} render={this.renderComponent(SearchPage)} />
                        <Route exact path={`/:lang(${langs})?/articles`} render={this.renderComponent(Articles)} />
                        <Route exact path={`/:lang(${langs})?/articles/:alias`} render={this.renderComponent(ArticlePage)} />
                        <Route exact path={`/:lang(${langs})?/contacts`} render={this.renderComponent(Contacts)} />
                        <Route exact path={`/:lang(${langs})?/promotions`} render={this.renderComponent(PromotionsPage)} />
                        <Route exact path={`/:lang(${langs})?/promotions/:alias`} render={this.renderComponent(ProductPage)} />
                        <Route exact path={`/:lang(${langs})?/:categoryAlias`} render={this.renderComponent(ProductsPage)} />
                        <Route exact path={`/:lang(${langs})?/:categoryAlias/:subCategoryAlias`} render={this.renderComponent(ProductsPage)} />
                        <Route exact path={`/:lang(${langs})?/:categoryAlias/:subCategoryAlias/:alias`} render={this.renderComponent(ProductPage)}/>
                        <Route render={this.renderComponent(NotFoundPage)}/>
                    </Switch>
                </div>
                <Footer />
                <CallbackCall />
            </div>
        </main>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
