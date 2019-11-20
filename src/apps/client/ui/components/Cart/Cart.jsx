import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import outsideClick from '../../hocs/outsideClick.jsx';
import propOr from '@tinkoff/utils/object/propOr';

import styles from './Cart.css';


const mapStateToProps = ({ data, application }) => {
    return {
        langRoute: application.langRoute,
        langMap: application.langMap
    };
};

@outsideClick
class Cart extends Component {
    static propTypes = {
        langRoute: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired
    };

    state = {
        active: false
    }

    handleClose = () => {
        this.setState({ active: false });
    }

    handleClick = () => {
        const { outsideClickEnabled } = this.props;
        const { active } = this.state;

        this.setState(state => ({ active: !state.active }));

        if (!active && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.handleClose);
        }
    }

    render () {
        const { langMap } = this.props;
        const { active } = this.state;
        const text = propOr('cart', {}, langMap);

        return (
            <div className={styles.cart}>
                <div className={styles.iconCartWrap} onClick={this.handleClick}>
                    <div className={styles.iconCart} />
                    <span className={styles.quantityAll}>0</span>
                </div>
                <div className={classNames(styles.popupContainer, { [styles.active]: active })}>
                    {/*<div className={styles.cover}/>*/}
                    <div className={styles.popup}>
                        <p className={styles.title}>{text.title}</p>
                        <div className={styles.totalPriceContainer}>
                            <div className={styles.totalPriceWrapper}>
                                <p className={styles.totalPrice}>{text.totalPrice}</p>
                                <p className={styles.totalPrice}>1 234&#8372;</p>
                            </div>
                        </div>
                        <button className={styles.checkoutBtn}>{text.checkout}</button><br/>
                        <button className={styles.continueShopping} onClick={this.handleClick}>{text.continueShopping}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Cart);
