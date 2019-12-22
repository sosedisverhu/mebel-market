import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import outsideClick from '../../hocs/outsideClick.jsx';
import propOr from '@tinkoff/utils/object/propOr';
import { MAX_QUANTITY } from '../../../constants/constants';
import styles from './Cart.css';

import deleteFromBasket from '../../../services/client/deleteFromBasket';
import saveProductsToWishlist from '../../../services/client/saveProductsToWishlist';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        basket: data.basket
    };
};

const mapDispatchToProps = (dispatch) => ({
    deleteFromBasket: payload => dispatch(deleteFromBasket(payload)),
    saveProductsToWishlist: payload => dispatch(saveProductsToWishlist(payload))
});

@outsideClick
class Cart extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        basket: PropTypes.array.isRequired,
        deleteFromBasket: PropTypes.func.isRequired,
        saveProductsToWishlist: PropTypes.func.isRequired
    };

    state = {
        active: false,
        quantityValue: 1
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

    render () {
        const { langMap, lang, basket } = this.props;
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
                        <p className={styles.title}>{text.title}</p>
                        {basket.length > 0
                            ? <div className={styles.productsContainer}>
                                {basket.map(({ properties, quantity, product, id: basketItemId }, i) =>
                                    <div className={styles.cartItemWrapper} key={i}>
                                        <div className={styles.cartItem}>
                                            <img className={styles.productImg} src={product.avatar} alt=""/>
                                            <div className={styles.productInfo}>
                                                <div>
                                                    <div className={styles.productOption}>
                                                        <p className={styles.productName}>{product.texts[lang].name}</p>
                                                        <p className={styles.productNumber}>(48092)</p>
                                                    </div>
                                                    <p className={styles.productSize}>{text.size} {product.sizes[0].name}</p>
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
                                                    <button className={styles.wishBtn} onClick={this.handleAddToWishlist(product)}>
                                                        <img className={styles.wishBtnImg} src="/src/apps/client/ui/components/Cart/img/wish-black.png" alt="wishlist"/>
                                                    </button>
                                                    <button className={styles.removeBtn} onClick={this.removeProduct(basketItemId)}>
                                                        <img className={styles.removeBtnImg} src="/src/apps/client/ui/components/Header/img/remove.png" alt="remove"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className={styles.totalPriceContainer}>
                                    <div className={styles.totalPriceWrapper}>
                                        <p className={styles.totalPrice}>{text.totalPrice}</p>
                                        <p className={styles.totalPrice}>0&#8372;</p>
                                    </div>
                                </div>
                            </div>
                            : <p>{text.noProduct}</p>
                        }
                        {basket.length > 0 &&
                            <button className={styles.checkoutBtn}>{text.checkout}</button>
                        }
                        <button className={styles.continueShopping} onClick={this.handlePopupClose}>{text.continueShopping}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
