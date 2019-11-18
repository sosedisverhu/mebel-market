import React, { Component } from 'react';
import PropTypes from 'prop-types';

import propOr from '@tinkoff/utils/object/propOr';

import { connect } from 'react-redux';
import { Link, withRouter, NavLink } from 'react-router-dom';

import styles from './Header.css';

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
                            <Link className={styles.menuItem} to={`${langRoute}/`}>{text.deliveryAndPayment}</Link>
                            <Link className={styles.menuItem} to={`${langRoute}/`}>{text.partners}</Link>
                            <Link className={styles.menuItem} to={`${langRoute}/`}>{text.articles}</Link>
                            <Link className={styles.menuItem} to={`${langRoute}/`}>{text.contacts}</Link>
                        </div>
                        <div className={styles.headerTopRight}>
                            <form className={styles.search}>
                                <input className={styles.searchInput} placeholder={text.search} type="text"/>
                                <button className={styles.searchBtn} type="submit"/>
                            </form>
                            <div className={styles.wishWrapper}>
                                <img className={styles.wishImg} src="/src/apps/client/ui/components/Header/img/wish.png" alt="Wish"/>
                            </div>
                            <div className={styles.cartWrapper}>
                                <img className={styles.cartImg} src="/src/apps/client/ui/components/Header/img/cart.png" alt="Wish"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.headerBottom}>
                    <div className={styles.content}>

                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Header);
