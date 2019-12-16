import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import outsideClick from '../../hocs/outsideClick.jsx';
import propOr from '@tinkoff/utils/object/propOr';
import { MAX_QUANTITY } from '../../../constants/constants';
import styles from './Cart.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

@outsideClick
class Cart extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool
    };

    state = {
        active: false,
        quantity: 1
    }

    handlePopupClose = () => {
        document.body.style.overflowY = 'visible';
        this.setState({ active: false });
    }

    handleClick = (test) => {
        const { outsideClickEnabled } = this.props;
        const { active } = this.state;

        document.body.style.overflowY = (!active) ? 'hidden' : 'visible';
        this.setState(state => ({ active: !state.active }));

        if (!active && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.handlePopupClose);
        }
    }

    quantityChange = (value) => {
        if (value >= 0 && value <= MAX_QUANTITY) {
            this.setState({ quantity: value });
        }
    };

    render () {
        const { langMap } = this.props;
        const { active, quantity } = this.state;
        const text = propOr('cart', {}, langMap);

        return (
            <div className={styles.cart}>
                <div className={styles.iconCartWrapper} onClick={this.handleClick}>
                    <img className={styles.iconCartImg} src="/src/apps/client/ui/components/Cart/img/cart.svg" alt="cart icon"/>
                    <span className={styles.quantityAll}>0</span>
                </div>
                <div className={classNames(styles.popupContainer, { [styles.active]: active })}>
                    <div className={styles.cover} onClick={this.handleClick}/>
                    <div className={styles.popup}>
                        <p className={styles.title}>{text.title}</p>
                        <div className={styles.productsContainer}>
                            <div className={styles.cartItemWrapper}>
                                <div className={styles.cartItem}>
                                    <img className={styles.productImg} src="" alt=""/>
                                    <div>
                                        <div className={styles.productOption}>
                                            <p className={styles.productName}>Кровать «Анталия»</p>
                                            <p className={styles.productNumber}>(48092)</p>
                                            <button className={styles.wishBtn}>
                                                <img className={styles.wishBtnImg} src="/src/apps/client/ui/components/Cart/img/wish-black.png" alt="Wish List"/>
                                            </button>
                                            <button className={styles.removeBtn}>
                                                <img className={styles.removeBtnImg} src="/src/apps/client/ui/components/Header/img/remove.png" alt="remove"/>
                                            </button>
                                        </div>
                                        <p className={styles.productSize}>{text.size} 190 х 200</p>
                                        <div className={styles.productQuantity}>
                                            <button
                                                className={styles.quantitySub}
                                                onClick={() => this.quantityChange(quantity - 1)}
                                                disabled={quantity <= 1}>-</button>
                                            <input
                                                className={styles.quantityInput}
                                                type="text"
                                                onChange={(e) => this.quantityChange(e.target.value.replace(/\D/, ''))}
                                                value={quantity}
                                                onBlur={(e) => (e.target.value === '' || +e.target.value === 0) && this.quantityChange(1)}
                                            />
                                            <button
                                                className={styles.quantityAdd}
                                                onClick={() => this.quantityChange(quantity + 1)}
                                                disabled={quantity >= MAX_QUANTITY}>+</button>
                                        </div>
                                        <div className={styles.productPrices}>
                                            <p className={styles.productOldPrice}>2 798&#8372;</p>
                                            <p className={styles.productPrice}>1 399&#8372;</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.totalPriceContainer}>
                            <div className={styles.totalPriceWrapper}>
                                <p className={styles.totalPrice}>{text.totalPrice}</p>
                                <p className={styles.totalPrice}>0&#8372;</p>
                            </div>
                        </div>
                        <button className={styles.checkoutBtn}>{text.checkout}</button>
                        <button className={styles.continueShopping} onClick={this.handlePopupClose}>{text.continueShopping}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Cart);
