import React, { Component } from 'react';
import PropTypes from 'prop-types';

import propOr from '@tinkoff/utils/object/propOr';

import { connect } from 'react-redux';
import { Link, withRouter, NavLink } from 'react-router-dom';

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
    static propTypes = {
        langRoute: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired
    };

    handleSubmit = (e) => {
        e.preventDefault();
    }

    render () {
        const { langRoute, langMap } = this.props;
        const text = propOr('header', {}, langMap);

        return (
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.content}>
                        <div className={styles.logoWrapper}>
                            <Link to={`${langRoute}/`}>
                                <img className={styles.logoImg} src="/src/apps/client/ui/components/Header/img/logo.png" alt="mebel market logo"/>
                            </Link>
                        </div>
                        <div className={styles.menuItemWrapper}>
                            <Link className={styles.menuItemTop} to={`${langRoute}/`}>{text.deliveryAndPayment}</Link>
                            <Link className={styles.menuItemTop} to={`${langRoute}/`}>{text.partners}</Link>
                            <Link className={styles.menuItemTop} to={`${langRoute}/`}>{text.articles}</Link>
                            <Link className={styles.menuItemTop} to={`${langRoute}/`}>{text.contacts}</Link>
                        </div>
                        <div className={styles.headerTopRight}>
                            <form className={styles.search} onSubmit={this.handleSubmit}>
                                <input className={styles.searchInput} placeholder={text.search} type="text"/>
                                <button className={styles.searchBtn} type="submit"/>
                            </form>
                            <WishList/>
                            <Cart/>
                            <LangSwitch/>
                        </div>
                    </div>
                </div>
                <div className={styles.headerBottom}>
                    <Link className={styles.menuItemBottom} to={`${langRoute}/`}>{text.beds}</Link>
                    <Link className={styles.menuItemBottom} to={`${langRoute}/`}>{text.mattresses}</Link>
                    <Link className={styles.menuItemBottom} to={`${langRoute}/`}>{text.softFurniture}</Link>
                    <Link className={styles.menuItemBottom} to={`${langRoute}/`}>{text.sleepAccessories}</Link>
                    <Link className={`${styles.menuItemBottom} ${styles.menuItemBottomPromotions}`} to={`${langRoute}/`}>{text.promotions}</Link>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Header);
