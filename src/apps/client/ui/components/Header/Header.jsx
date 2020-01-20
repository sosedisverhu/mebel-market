import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import classNames from 'classnames';

import LangSwitch from '../LangSwitch/LangSwitch.jsx';
import Cart from '../Cart/Cart.jsx';
import WishList from '../WishList/WishList.jsx';

import styles from './Header.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langRoute: application.langRoute,
        langMap: application.langMap,
        lang: application.lang,
        categories: data.categories
    };
};

class Header extends Component {
    state = {
        mobileMenuOpen: false,
        searchBarOpen: false,
        searchText: ''
    };

    static propTypes = {
        langRoute: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        categories: PropTypes.array
    };

    static defaultProps = {
        categories: []
    };

    handleMobileMenu = () => {
        document.body.style.overflowY = (!this.state.mobileMenuOpen) ? 'hidden' : 'visible';
        this.setState(state => ({ mobileMenuOpen: !state.mobileMenuOpen }));
    };

    handleSearchSubmit = e => {
        e.preventDefault();
        const { langRoute } = this.props;
        const { searchText } = this.state;

        if (searchText) {
            this.props.history.push(`${langRoute}/search?text=${searchText}`);
        }
    };

    handleSearchBar = () => {
        const { searchText } = this.state;

        if (!searchText) {
            this.setState(state => ({ searchBarOpen: !state.searchBarOpen }));
        }
    };

    handleInputChange = e => {
        this.setState({
            searchText: e.target.value
        });
    };

    render () {
        const { langRoute, langMap, lang, categories } = this.props;
        const { mobileMenuOpen, searchBarOpen, searchText } = this.state;
        const text = propOr('header', {}, langMap);

        return (
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.content}>
                        <div className={styles.mobileMenu} onClick={this.handleMobileMenu}>
                            <button className={classNames(styles.mobileMenuBtn, { [styles.active]: mobileMenuOpen })}>
                                <span/>
                                <span/>
                                <span/>
                                <span/>
                            </button>
                            <div className={classNames(styles.popupContainer, { [styles.active]: mobileMenuOpen })}>
                                <div className={classNames(styles.popupMobile, { [styles.active]: mobileMenuOpen })}>
                                    <div className={styles.mobileMenuTop}>
                                        {categories.map((category) => {
                                            return <Link
                                                className={styles.mobileMenuItemTop}
                                                to={`${langRoute}/${category.alias}`}
                                                key={category.id}
                                            >
                                                {category.texts[lang].name}
                                            </Link>;
                                        })}
                                        <Link
                                            className={classNames(styles.mobileMenuItemTop, styles.menuItemTopPromotions)}
                                            to={`${langRoute}/`}
                                        >
                                            {text.promotions}
                                        </Link>
                                    </div>
                                    <div className={styles.mobileSocials}>
                                        <a href="#" target="_blank">
                                            <img
                                                className={styles.instagram}
                                                src="/src/apps/client/ui/components/Header/img/instagram.svg"
                                                alt="instagram"/>
                                        </a>
                                        <a href="#" target="_blank">
                                            <img className={styles.facebook}
                                                src="/src/apps/client/ui/components/Header/img/facebook.svg"
                                                alt="facebook"/>
                                        </a>
                                        <a href="#" target="_blank">
                                            <img className={styles.youtube}
                                                src="/src/apps/client/ui/components/Header/img/youtube.svg"
                                                alt="youtube"/>
                                        </a>
                                    </div>
                                    <div className={styles.mobileMenuBottom}>
                                        <Link className={styles.mobileMenuItemBottom}
                                            to={`${langRoute}/delivery-and-payment`}>{text.deliveryAndPayment}</Link>
                                        <Link className={styles.mobileMenuItemBottom}
                                            to={`${langRoute}/partners`}>{text.partners}</Link>
                                        <Link className={styles.mobileMenuItemBottom}
                                            to={`${langRoute}/articles`}>{text.articles}</Link>
                                        <Link className={styles.mobileMenuItemBottom}
                                            to={`${langRoute}/contacts`}>{text.contacts}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.logoWrapper}>
                            <Link to={`${langRoute}/`}>
                                <img className={styles.logoImg} src="/src/apps/client/ui/components/Header/img/logo.png"
                                    alt="mebel market logo"/>
                            </Link>
                        </div>
                        <div className={styles.menuTop}>
                            <NavLink
                                className={styles.menuItemTop}
                                activeClassName={styles.active}
                                to={`${langRoute}/delivery-and-payment`}
                            >
                                {text.deliveryAndPayment}
                            </NavLink>
                            <NavLink
                                className={styles.menuItemTop}
                                activeClassName={styles.active}
                                to={`${langRoute}/partners`}
                            >
                                {text.partners}
                            </NavLink>
                            <NavLink
                                className={styles.menuItemTop}
                                activeClassName={styles.active}
                                to={`${langRoute}/articles`}
                            >
                                {text.articles}
                            </NavLink>
                            <NavLink
                                className={styles.menuItemTop}
                                activeClassName={styles.active}
                                to={`${langRoute}/contacts`}
                            >
                                {text.contacts}
                            </NavLink>
                        </div>
                        <div className={styles.headerTopRight}>
                            <form className={styles.search} onSubmit={this.handleSearchSubmit}>
                                <label
                                    className={classNames(styles.searchInputWrapper, { [styles.active]: searchBarOpen })}>
                                    <input
                                        className={classNames(styles.searchInput, { [styles.active]: searchBarOpen })}
                                        placeholder={text.search}
                                        type="text"
                                        value={searchText}
                                        onChange={this.handleInputChange}
                                    />
                                </label>
                                <button onClick={this.handleSearchBar} className={styles.searchBtn} type="submit"/>
                            </form>
                            <WishList/>
                            <Cart/>
                            <LangSwitch/>
                        </div>
                    </div>
                </div>
                <div className={styles.headerBottom}>
                    <div className={styles.menuBottom}>
                        {categories.map((category) => {
                            return <NavLink
                                className={styles.menuItemBottom}
                                activeClassName={styles.active}
                                to={`${langRoute}/${category.alias}`}
                                key={category.id}
                            >
                                {category.texts[lang].name}
                            </NavLink>;
                        })}
                        <Link className={classNames(styles.menuItemBottom, styles.menuItemBottomPromotions)}
                            to={`${langRoute}/`}>
                            {text.promotions}
                        </Link>
                    </div>
                    <form className={styles.searchBottom} onSubmit={this.handleSearchSubmit}>
                        <label className={classNames(styles.searchInputWrapperBottom, { [styles.active]: searchBarOpen })}>
                            <input
                                className={classNames(styles.searchInputBottom, { [styles.active]: searchBarOpen })}
                                placeholder={text.search}
                                type="text"
                                value={searchText}
                                onChange={this.handleInputChange}
                            />
                        </label>
                        <button className={styles.searchBtnBottom} type="submit"/>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(Header));
