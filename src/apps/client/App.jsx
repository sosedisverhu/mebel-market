import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../../client/vendor';
import '../../css/main.css';

import media from './ui/hocs/media/media.jsx';
import lang from './ui/hocs/lang/lang.jsx';

import { connect } from 'react-redux';

import Header from './ui/components/Header/Header.jsx';
import Footer from './ui/components/Footer/Footer.jsx';
import MainPage from './ui/pages/MainPage/MainPage.jsx';
import ProductPage from './ui/pages/ProductPage/ProductPage.jsx';
import NotFoundPage from './ui/components/NotFoundPage/NotFoundPage.jsx';
import DeliveryAndPayment from './ui/pages/DeliveryAndPayment/DeliveryAndPayment.jsx';
import Partners from './ui/pages/Partners/Partners.jsx';
import Articles from './ui/pages/Articles/Articles.jsx';
import Article from './ui/components/Article/Article.jsx';
import Contacts from './ui/pages/Contacts/Contacts.jsx';

import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import getLangRouteParts from './utils/getLangRouteParts';

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
        langRoute: PropTypes.string
    };

    static defaultProps = {
        langRoute: ''
    };

    renderComponent = Component => ({ match: { params: { lang: langUrl = this.props.lang }, path }, location: { pathname } }) => {
        if (typeof window === 'undefined') {
            return <Component />;
        }

        const { lang, langRoute } = this.props;
        const { routeWithoutLang } = getLangRouteParts(pathname);

        return lang === langUrl ? <Component /> : <Redirect to={`${langRoute}${routeWithoutLang}`} />;
    };

    render () {
        return <main>
            <div className={styles.page}>
                <Header/>
                <div className={styles.pageContent}>
                    <Switch>
                        <Route exact path={`/:lang(${langs})?`} render={this.renderComponent(MainPage)} />
                        <Route exact path={`/:lang(${langs})?/delivery-and-payment`} render={this.renderComponent(DeliveryAndPayment)}/>
                        <Route exact path={`/:lang(${langs})?/partners`} render={this.renderComponent(Partners)} />
                        <Route exact path={`/:lang(${langs})?/articles`} render={this.renderComponent(Articles)} />  
                        <Route exact path={`/:lang(${langs})?/articles/:id`} render={this.renderComponent(Article)} />            
                        <Route exact path={`/:lang(${langs})?/:categoryId/:id`} render={this.renderComponent(ProductPage)}/>      
                        <Route exact path={`/:lang(${langs})?/contacts`} render={this.renderComponent(Contacts)} />
                        <Route render={this.renderComponent(NotFoundPage)}/>
                    </Switch>
                </div>
                <Footer />
            </div>
        </main>;
    }
}

export default withRouter(connect(mapStateToProps)(App));
