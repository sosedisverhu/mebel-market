import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import outsideClick from '../../hocs/outsideClick.jsx';
import propOr from '@tinkoff/utils/object/propOr';
import findIndex from '@tinkoff/utils/array/findIndex';
import includes from '@tinkoff/utils/array/includes';
import find from '@tinkoff/utils/array/find';
import { MAX_QUANTITY } from '../../../constants/constants';
import styles from './Cart.css';

import deleteFromBasket from '../../../services/client/deleteFromBasket';
import saveProductsToWishlist from '../../../services/client/saveProductsToWishlist';

const mapStateToProps = ({ application, data }) => {
    return {
        langRoute: application.langRoute,
        langMap: application.langMap,
        lang: application.lang,
        basket: data.basket,
        categories: data.categories,
        subCategories: data.subCategories
    };
};

const mapDispatchToProps = (dispatch) => ({
    deleteFromBasket: payload => dispatch(deleteFromBasket(payload)),
    saveProductsToWishlist: payload => dispatch(saveProductsToWishlist(payload))
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
        subCategories: PropTypes.array
    };

    state = {
        active: false,
        quantityValue: 1
    }

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
            this.setState({ quantityValue: value });
        }
    };

    removeProduct = basketItemId => () => {
        this.props.deleteFromBasket(basketItemId);
    };

    handleAddToWishlist = product => () => {
        this.props.saveProductsToWishlist({
            productId: product.id
        });
    }

    handleCheckout = () => {
        this.setState(state => ({ ...state, active: !state.active }));
    }

    getCategoriesAlias = (categoryId, subCategoryId) => {
        const { categories, subCategories } = this.props;
        const category = find(category => category.id === categoryId, categories).alias;
        const subCategory = find(subCategory => subCategory.id === subCategoryId, subCategories).alias;

        return `${category}/${subCategory}`;
    }

    render () {
        const { langRoute, langMap, lang, basket } = this.props;
        const { active, quantityValue } = this.state;
        const text = propOr('cart', {}, langMap);

        return (
            <div className={styles.cart}>
                <div className={styles.iconCartWrapper} onClick={this.handleClick}>
                    <img className={styles.iconCartImg} src="/src/apps/client/ui/components/Cart/img/cart.svg" alt="cart icon"/>
                    <span className={styles.quantityAll}>{basket.length}</span>
                </div>
                <div className={classNames(styles.popupContainer, { [styles.active]: active })}>
                    <div className={styles.cover} onClick={this.handleClick}/>
                    <div className={styles.popup}>
                        <p className={styles.title}>
                            {text.title} {basket.length > 0 &&
                            <span>
                                {basket.length}&nbsp;
                                {this.getWordCaseByNumber(basket.length,
                                    lang === 'ru' ? ['товаров', 'товар', 'товара'] : ['товарів', 'товар', 'товари'])}
                            </span>
                            }</p>
                        {basket.length > 0
                            ? <div className={styles.productsContainer}>
                                {basket.map(({ properties, quantity, product, id: basketItemId }, i) => {
                                    return <div className={styles.cartItemWrapper} key={i}>
                                        <div className={styles.cartItem}>
                                            <Link className={styles.productImgLink} to={`${langRoute}/${this.getCategoriesAlias(product.categoryId, product.subCategoryId)}/${product.alias}`} onClick={this.handlePopupClose}>
                                                <img className={styles.productImg} src={product.avatar} alt=""/>
                                            </Link>
                                            <div className={styles.productInfo}>
                                                <div>
                                                    <div className={styles.productOption}>
                                                        <Link className={styles.productNameLink} to={`${langRoute}/${this.getCategoriesAlias(product.categoryId, product.subCategoryId)}/${product.alias}`} onClick={this.handlePopupClose}>
                                                            <p className={styles.productName}>{product.texts[lang].name}</p>
                                                        </Link>
                                                        <p className={styles.productNumber}>(48092)</p>
                                                    </div>
                                                    <p className={styles.productSize}>{text.size} {properties.size.name}</p>
                                                    <div className={styles.productQuantity}>
                                                        <button
                                                            className={styles.quantitySub}
                                                            onClick={() => this.quantityChange(+quantityValue - 1)}
                                                            disabled={quantityValue <= 1}>-</button>
                                                        <input
                                                            className={styles.quantityInput}
                                                            type="text"
                                                            onChange={(e) => this.quantityChange(e.target.value.replace(/\D/, ''))}
                                                            value={quantityValue}
                                                            onBlur={(e) => (e.target.value === '' || +e.target.value === 0) && this.quantityChange(1)}
                                                        />
                                                        <button
                                                            className={styles.quantityAdd}
                                                            onClick={() => this.quantityChange(+quantityValue + 1)}
                                                            disabled={quantityValue >= MAX_QUANTITY}>+</button>
                                                    </div>
                                                    <div className={styles.productPrices}>
                                                        <p className={styles.productOldPrice}>{product.price}&#8372;</p>
                                                        <p className={styles.productPrice}>{product.discountPrice}&#8372;</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button className={styles.wishBtn} onClick={this.handleAddToWishlist(product)} />
                                                    <button className={styles.removeBtn} onClick={this.removeProduct(basketItemId)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>
                            : <p>{text.noProduct}</p>
                        }
                        {basket.length > 0 &&
                            <div className={styles.cartBottomInfo}>
                                <div className={styles.totalPriceContainer}>
                                    <div className={styles.totalPriceWrapper}>
                                        <p className={styles.totalPrice}>{text.totalPrice}</p>
                                        <p className={styles.totalPrice}>0&#8372;</p>
                                    </div>
                                </div>
                                <Link to={`${langRoute}/order/`} >
                                    <button className={styles.checkoutBtn} onClick={this.handleCheckout}>{text.checkout}</button>
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
