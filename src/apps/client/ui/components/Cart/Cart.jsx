import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';

import CartProduct from '../CartProduct/CartProduct';

import outsideClick from '../../hocs/outsideClick.jsx';

import openBasket from '../../../actions/openBasket';
import closeBasket from '../../../actions/closeBasket';

import formatWordDeclension from '../../../utils/formatWordDeclension';

import formatMoney from '../../../utils/formatMoney';
import getShares from '../../../utils/getShares';
import getProductsPrice from '../../../utils/getProductsPrice';
import getSharesPrice from '../../../utils/getSharesPrice';

import styles from './Cart.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langRoute: application.langRoute,
        langMap: application.langMap,
        lang: application.lang,
        basket: data.basket,
        basketIsOpen: data.basketIsOpen
    };
};

const mapDispatchToProps = dispatch => ({
    openBasket: payload => dispatch(openBasket(payload)),
    closeBasket: payload => dispatch(closeBasket(payload))
});

@outsideClick
class Cart extends Component {
    static propTypes = {
        langRoute: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        basket: PropTypes.array.isRequired,
        basketIsOpen: PropTypes.bool.isRequired,
        openBasket: PropTypes.func.isRequired,
        closeBasket: PropTypes.func.isRequired
    };

    // productsWithShare = [
    //     {
    //         productId: 'Кровать 1',
    //         maxQuantity: '4'
    //     }
    // ];

    constructor (...args) {
        super(...args);
        const { basket, lang } = this.props;

        this.state = {
            shares: getShares(basket, lang)
        };
    }

    handlePopupClose = () => {
        document.body.style.overflowY = 'visible';
        document.documentElement.style.overflowY = 'visible'; // для Safari на iPhone/iPad
        this.props.closeBasket();
    };

    handleClick = () => {
        const { outsideClickEnabled, turnOnClickOutside, basketIsOpen, openBasket } = this.props;

        document.body.style.overflowY = !basketIsOpen ? 'hidden' : 'visible';
        document.documentElement.style.overflowY = !basketIsOpen ? 'hidden' : 'visible'; // для Safari на iPhone/iPad

        if (!basketIsOpen && !outsideClickEnabled) {
            turnOnClickOutside(this, this.handlePopupClose);
        }
        openBasket();
    };

    componentWillReceiveProps (nextProps) {
        if (this.props.basket !== nextProps.basket) {
            this.setState({ shares: getShares(nextProps.basket, nextProps.lang) });
        }
    }

    render () {
        const { langRoute, langMap, basket, basketIsOpen, lang } = this.props;
        const { shares } = this.state;
        const text = propOr('cart', {}, langMap);
        const quantityAll = basket.reduce((sum, { quantity }) => sum + quantity, 0);
        const productsPrice = getProductsPrice(basket, lang);
        const sharesPrice = getSharesPrice(shares);
        const totalPrice = productsPrice - sharesPrice;

        return (
            <div className={styles.cart}>
                <div className={styles.iconCartWrapper} onClick={!basketIsOpen ? this.handleClick : this.handlePopupClose}>
                    <img className={styles.iconCartImg} src="/src/apps/client/ui/components/Cart/img/cart.svg" alt="cart icon"/>
                    <span className={styles.quantityAll}>{quantityAll}</span>
                </div>
                <div className={classNames(styles.popupContainer, { [styles.active]: basketIsOpen })}>
                    <div className={styles.cover} onClick={!basketIsOpen ? this.handleClick : this.handlePopupClose}/>
                    <div className={styles.popup}>
                        <p className={styles.title}>
                            {text.title} {basket.length > 0 &&
                        <span>
                            {quantityAll}&nbsp;
                            {formatWordDeclension(text.product, basket.length)}
                        </span>
                            }</p>
                        {basket.length > 0
                            ? <div className={styles.productsContainer}>
                                {basket.map(({ properties, quantity, product, id: basketItemId }, i) => <CartProduct
                                    product={product}
                                    quantity={quantity}
                                    properties={properties}
                                    basketItemId={basketItemId}
                                    shares={shares}
                                    key={i}/>
                                )}
                            </div>
                            : <p className={styles.noProducts}>{text.noProduct}</p>
                        }
                        {basket.length > 0 &&
                        <div className={styles.cartBottomInfo}>
                            <div className={styles.totalPriceContainer}>
                                {!!sharesPrice && <div className={styles.totalPriceWrapper}>
                                    <p className={classNames(styles.totalPrice, styles.small)}>{text.priceWithoutShare}</p>
                                    <p className={classNames(styles.totalPrice, styles.small)}>
                                        {formatMoney(productsPrice)}
                                    </p>
                                </div>}
                                {!!sharesPrice && <div className={styles.totalPriceWrapper}>
                                    <p className={classNames(styles.totalPrice, styles.small)}>{text.shareValue}</p>
                                    <p className={classNames(styles.totalPrice, styles.small)}>
                                        {formatMoney(sharesPrice)}
                                    </p>
                                </div>}
                                <div className={styles.totalPriceWrapper}>
                                    <p className={styles.totalPrice}>
                                        {text.totalPrice}
                                    </p>
                                    <p className={styles.totalPrice}>
                                        {formatMoney(totalPrice)}
                                    </p>
                                </div>
                            </div>
                            <Link to={`${langRoute}/order`} >
                                <button className={styles.checkoutBtn} onClick={this.handlePopupClose}>
                                    {text.checkout}
                                </button>
                            </Link>
                        </div>
                        }
                        <button className={styles.continueShopping} onClick={this.handlePopupClose}>
                            {text.continueShopping}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
