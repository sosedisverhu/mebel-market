import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';
import findIndex from '@tinkoff/utils/array/findIndex';
import includes from '@tinkoff/utils/array/includes';

import CartProduct from '../CartProduct/CartProduct';

import deleteFromBasket from '../../../services/client/deleteFromBasket';
import saveProductsToWishlist from '../../../services/client/saveProductsToWishlist';
import outsideClick from '../../hocs/outsideClick.jsx';

import openBasket from '../../../actions/openBasket';
import closeBasket from '../../../actions/closeBasket';

import formatMoney from '../../../utils/formatMoney';
import styles from './Cart.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langRoute: application.langRoute,
        langMap: application.langMap,
        lang: application.lang,
        basket: data.basket,
        categories: data.categories,
        subCategories: data.subCategories,
        basketIsOpen: data.basketIsOpen
    };
};

const mapDispatchToProps = dispatch => ({
    deleteFromBasket: payload => dispatch(deleteFromBasket(payload)),
    saveProductsToWishlist: payload => dispatch(saveProductsToWishlist(payload)),
    openBasket: payload => dispatch(openBasket(payload)),
    closeBasket: payload => dispatch(closeBasket(payload))
});

const EXCEPTION_NUMBERS_MIN = 11;
const EXCEPTION_NUMBERS_MAX = 14;
const CASES_GROUPS = [[0, 5, 6, 7, 8, 9, 10, 11, 12], [1], [2, 3, 4]];

@outsideClick
class Cart extends Component {
    static propTypes = {
        langRoute: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        basket: PropTypes.array.isRequired,
        deleteFromBasket: PropTypes.func.isRequired,
        saveProductsToWishlist: PropTypes.func.isRequired,
        categories: PropTypes.array,
        subCategories: PropTypes.array,
        basketIsOpen: PropTypes.bool.isRequired,
        openBasket: PropTypes.func.isRequired,
        closeBasket: PropTypes.func.isRequired
    };

    getWordCaseByNumber (number, cases) {
        if (number >= EXCEPTION_NUMBERS_MIN && number <= EXCEPTION_NUMBERS_MAX) {
            return cases[0];
        }

        const lastNumber = number % 10;
        const resultIndex = findIndex((group) => includes(lastNumber, group), CASES_GROUPS);

        return cases[resultIndex];
    }

    handlePopupClose = () => {
        document.body.style.overflowY = 'visible';
        this.props.closeBasket();
    };

    handleClick = () => {
        const { outsideClickEnabled, turnOnClickOutside, basketIsOpen, openBasket } = this.props;

        document.body.style.overflowY = (!basketIsOpen) ? 'hidden' : 'visible';

        if (!basketIsOpen && !outsideClickEnabled) {
            turnOnClickOutside(this, this.handlePopupClose);
        }
        openBasket();
    };

    render () {
        const { langRoute, langMap, lang, basket, basketIsOpen } = this.props;
        const text = propOr('cart', {}, langMap);
        const quantityAll = basket.reduce((sum, { quantity }) => sum + quantity, 0);
        const totalPrice = basket.reduce((sum, { quantity, product }) => sum + (quantity * product.discountPrice || quantity * product.price), 0);

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
                                {this.getWordCaseByNumber(quantityAll,
                                    lang === 'ru' ? ['товаров', 'товар', 'товара'] : ['товарів', 'товар', 'товари'])}
                            </span>
                            }</p>
                        {basket.length > 0
                            ? <div className={styles.productsContainer}>
                                {basket.map(({ properties, quantity, product, id: basketItemId }, i) =>
                                    <CartProduct product={product} quantity={quantity} properties={properties} basketItemId={basketItemId} key={i} />
                                )}
                            </div>
                            : <p>{text.noProduct}</p>
                        }
                        {basket.length > 0 &&
                            <div className={styles.cartBottomInfo}>
                                <div className={styles.totalPriceContainer}>
                                    <div className={styles.totalPriceWrapper}>
                                        <p className={styles.totalPrice}>{text.totalPrice}</p>
                                        <p className={styles.totalPrice}>{formatMoney(totalPrice)}</p>
                                    </div>
                                </div>
                                <Link to={`${langRoute}/order/`} >
                                    <button className={styles.checkoutBtn} onClick={this.handlePopupClose}>{text.checkout}</button>
                                </Link>
                            </div>
                        }
                        <button className={styles.continueShopping} onClick={this.handlePopupClose}>{text.continueShopping}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
