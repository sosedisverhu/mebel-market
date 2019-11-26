import React, { Component } from 'react';
import PropTypes from 'prop-types';
import propOr from '@tinkoff/utils/object/propOr';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import styles from './Header.css';
import LangSwitch from '../LangSwitch/LangSwitch.jsx';
import Cart from '../Cart/Cart.jsx';
import WishList from '../WishList/WishList.jsx';

const mapStateToProps = ({ application }) => {
    return {
        langRoute: application.langRoute,
        langMap: application.langMap
    };
};

class Header extends Component {
    state = {
        mobileMenuOpen: false,
        searchBarOpen: false
    }

    static propTypes = {
        langRoute: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired
    };

    handleMobileMenu = () => {
        this.setState(state => ({ mobileMenuOpen: !state.mobileMenuOpen }));
    }

    handleSearchSubmit = (e) => {
        e.preventDefault();
    }

    handleSearchBar = () => {
        this.setState(state => ({ searchBarOpen: !state.searchBarOpen }))
    }

    render () {
        const { langRoute, langMap } = this.props;
        const { mobileMenuOpen, searchBarOpen } = this.state;
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
                                        <Link className={styles.mobileMenuItemTop} to={`${langRoute}/`}>{text.beds}</Link>
                                        <Link className={styles.mobileMenuItemTop} to={`${langRoute}/`}>{text.mattresses}</Link>
                                        <Link className={styles.mobileMenuItemTop} to={`${langRoute}/`}>{text.softFurniture}</Link>
                                        <Link className={styles.mobileMenuItemTop} to={`${langRoute}/`}>{text.sleepAccessories}</Link>
                                        <Link className={`${styles.mobileMenuItemTop} ${styles.menuItemTopPromotions}`} to={`${langRoute}/`}>{text.promotions}</Link>
                                    </div>
                                    <div className={styles.mobileSocials}>
                                        <a href="#" target="_blank">
                                            <img className={styles.googlePlus} src="/src/apps/client/ui/components/Header/img/google-plus.svg" alt="google plus"/>
                                        </a>
                                        <a href="#" target="_blank">
                                             <img className={styles.facebook} src="/src/apps/client/ui/components/Header/img/facebook.svg" alt="facebook"/>
                                        </a>
                                    </div>
                                    <div className={styles.mobileMenuBottom}>
                                        <Link className={styles.mobileMenuItemBottom} to={`${langRoute}/delivery-and-payment`}>{text.deliveryAndPayment}</Link>
                                        <Link className={styles.mobileMenuItemBottom} to={`${langRoute}/partners`}>{text.partners}</Link>
                                        <Link className={styles.mobileMenuItemBottom} to={`${langRoute}/articles`}>{text.articles}</Link>
                                        <Link className={styles.mobileMenuItemBottom} to={`${langRoute}/contacts`}>{text.contacts}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.logoWrapper}>
                            <Link to={`${langRoute}/`}>
                                <img className={styles.logoImg} src="/src/apps/client/ui/components/Header/img/logo.png" alt="mebel market logo"/>
                            </Link>
                        </div>
                        <div className={styles.menuTop}>
                            <Link className={styles.menuItemTop} to={`${langRoute}/delivery-and-payment`}>{text.deliveryAndPayment}</Link>
                            <Link className={styles.menuItemTop} to={`${langRoute}/partners`}>{text.partners}</Link>
                            <Link className={styles.menuItemTop} to={`${langRoute}/articles`}>{text.articles}</Link>
                            <Link className={styles.menuItemTop} to={`${langRoute}/contacts`}>{text.contacts}</Link>
                        </div>
                        <div className={styles.headerTopRight}>
                            <form className={styles.search} onSubmit={this.handleSearchSubmit}>
                                <label className={classNames(styles.searchInputWrapper, { [styles.active]: searchBarOpen })}>
                                    <input className={classNames(styles.searchInput, { [styles.active]: searchBarOpen })} placeholder={text.search} type="text"/>
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
                        <Link className={styles.menuItemBottom} to={`${langRoute}/`}>{text.beds}</Link>
                        <Link className={styles.menuItemBottom} to={`${langRoute}/`}>{text.mattresses}</Link>
                        <Link className={styles.menuItemBottom} to={`${langRoute}/`}>{text.softFurniture}</Link>
                        <Link className={styles.menuItemBottom} to={`${langRoute}/`}>{text.sleepAccessories}</Link>
                        <Link className={`${styles.menuItemBottom} ${styles.menuItemBottomPromotions}`} to={`${langRoute}/`}>{text.promotions}</Link>
                    </div>
                    <form className={styles.searchBottom} onSubmit={this.handleSearchSubmit}>
                        <label className={classNames(styles.searchInputWrapperBottom, { [styles.active]: searchBarOpen })}>
                            <input className={classNames(styles.searchInputBottom, { [styles.active]: searchBarOpen })} placeholder={text.search} type="text"/>
                        </label>
                        <button className={styles.searchBtnBottom} type="submit"/>
                    </form>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps)(Header));
