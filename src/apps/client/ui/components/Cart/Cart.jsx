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
import styles from './Cart.css';
import find from '@tinkoff/utils/array/find';

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
            shares: this.getShares(basket, lang)
        };
    }

    getShares = (basket, lang) => {
        let shares = [];
        const resultShares = [];

        basket.forEach(({ product, quantity, properties }) => {
            const size = product.sizes[lang].find(productSize => productSize.id === properties.size.id);
            const color = size.colors.find(color => color.id === properties.size.color.id);

            for (let i = 0; i < quantity; i++) {
                const sharesProducts = [];
                (size.shares || []).forEach(share => {
                    const products = share.products.map(shareProduct => {
                        return {
                            id: shareProduct.value,
                            inCart: false,
                            price: color.discountPrice || color.price
                        };
                    });
                    const shareProducts = {
                        type: share.type,
                        products: products,
                        value: +share.value
                    };

                    sharesProducts.push(shareProducts);
                });

                if (sharesProducts.length) shares.push(sharesProducts);
            }
        });

        basket.forEach(({ product, quantity }) => {
            const isShareProduct = this.getIsShareProduct(product.id, basket, lang);

            if (!isShareProduct) return;

            const discountProductId = product.id;

            for (let i = 0; i < quantity; i++) {
                let flagIsThisProductInShares = false;

                shares.forEach(shareProducts => {
                    if (flagIsThisProductInShares) return;

                    const shareProduct = find(shareProduct => shareProduct.products.some(productItem => productItem.inCart), shareProducts);

                    if (shareProduct && !shareProduct.products.some(product => product.id === discountProductId)) return;

                    shareProducts.forEach(shareProduct => {
                        if (flagIsThisProductInShares) return;

                        shareProduct.products.forEach(productItem => {
                            if (productItem.id === discountProductId && !productItem.inCart) {
                                productItem.inCart = true;
                                flagIsThisProductInShares = true;
                            }
                        });
                    });
                });
            }
        });

        shares.forEach(shareProducts => {
            const shareResultItem = find(shareProduct => shareProduct.products.some(productItem => productItem.inCart), shareProducts);

            if (!shareResultItem) return;

            const productsInCart = shareResultItem.products.filter(product => product.inCart);
            const shareResultItemProducts = productsInCart.map(product => {
                return product.id;
            });

            let shareResultItemValue = shareResultItem.value;
            if (shareResultItem.type === 'present') {
                shareResultItemValue = productsInCart.reduce((sum, currentProduct) => {
                    return sum + currentProduct.price;
                }, 0);
            }

            resultShares.push({
                type: shareResultItem.type,
                products: shareResultItemProducts,
                value: shareResultItemValue
            });
        });

        return resultShares;
    };

    getIsShareProduct = (currentProductId, basket, lang) => {
        let isShare = false;

        basket.forEach(({ product, properties }) => {
            const size = product.sizes[lang].find(productSize => productSize.id === properties.size.id);
            (size.shares || []).forEach(share => {
                if (share.products.some(product => product.value === currentProductId)) {
                    isShare = true;
                }
            });
        });

        // console.log('currentProductId', currentProductId);
        // console.log('isShare', isShare);

        return isShare;
    };

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

    getProductsPrice = (basket, lang) => {
        const productsPrice = basket.reduce((sum, { quantity, product, properties }) => {
            const size = product.sizes[lang].find(productSize => productSize.id === properties.size.id);
            const color = size.colors.find(color => color.id === properties.size.color.id);
            let productPrice = color.discountPrice || color.price;
            const allFeatures = size.features || [];
            const checkedFeatureIds = properties.features || {};
            const checkedFeatures = allFeatures.filter(feature => checkedFeatureIds[feature.id]);
            const featuresPrice = checkedFeatures.reduce((sum, { value }) => sum + value, 0);

            return sum + (quantity * (productPrice + featuresPrice));
        }, 0);

        return productsPrice;
    };

    getSharesPrice = (shares) => {
        const sharesPrice = shares.reduce((sum, currentShare) => {
            return sum + currentShare.value;
        }, 0);

        return sharesPrice;
    };

    componentWillReceiveProps (nextProps) {
        if (this.props.basket !== nextProps.basket) {
            this.setState({ shares: this.getShares(nextProps.basket, nextProps.lang) });
        }
    }

    render () {
        const { langRoute, langMap, basket, basketIsOpen, lang } = this.props;
        const { shares } = this.state;
        const text = propOr('cart', {}, langMap);
        const quantityAll = basket.reduce((sum, { quantity }) => sum + quantity, 0);
        const productsPrice = this.getProductsPrice(basket, lang);
        const sharesPrice = this.getSharesPrice(shares);
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
                                {basket.map(({ properties, quantity, product, id: basketItemId }, i) => {
                                    const presentsQuantity = shares.filter(share => share.type === 'present').reduce((counter, share) => {
                                        if (share.products.some(shareProductId => shareProductId === product.id)) {
                                            return counter + 1;
                                        }
                                        return counter;
                                    }, 0);
                                    const discountsQuantity = shares.filter(share => share.type === 'discount').reduce((counter, share) => {
                                        if (share.products.some(shareProductId => shareProductId === product.id)) return counter + 1;
                                        return counter;
                                    }, 0);

                                    return (
                                        <CartProduct product={product}
                                            quantity={quantity}
                                            properties={properties}
                                            basketItemId={basketItemId}
                                            presentsQuantity={presentsQuantity}
                                            discountsQuantity={discountsQuantity}
                                            key={i}/>
                                    );
                                })}
                            </div>
                            : <p className={styles.noProducts}>{text.noProduct}</p>
                        }
                        {basket.length > 0 &&
                        <div className={styles.cartBottomInfo}>
                            {/* test block start */}
                            <div style={{ border: '1px solid red', width: '100%', padding: '10px 35px' }}>
                                <p>{`Цена без скидки: ${productsPrice}`}</p>
                                <p>{`Размер скидки: ${sharesPrice}`}</p>
                            </div>
                            {/* test block end */}
                            <div className={styles.totalPriceContainer}>
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
