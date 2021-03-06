import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import outsideClick from '../../hocs/outsideClick.jsx';
import propOr from '@tinkoff/utils/object/propOr';

import styles from './WishList.css';

import formatWordDeclension from '../../../utils/formatWordDeclension';
import deleteFromWishlist from '../../../services/client/deleteFromWishlist';
import saveProductsToBasket from '../../../services/client/saveProductsToBasket';
import formatMoney from '../../../utils/formatMoney';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        windowWidth: application.media.width,
        wishlist: data.wishlist,
        basket: data.basket
    };
};

const mapDispatchToProps = dispatch => ({
    deleteFromWishlist: payload => dispatch(deleteFromWishlist(payload)),
    saveProductsToBasket: payload => dispatch(saveProductsToBasket(payload))
});

@outsideClick
class WishList extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        wishlist: PropTypes.array.isRequired,
        deleteFromWishlist: PropTypes.func.isRequired,
        saveProductsToBasket: PropTypes.func.isRequired,
        basket: PropTypes.array.isRequired,
        windowWidth: PropTypes.number.isRequired
    };

    state = {
        active: false
    };

    handlePopupClose = () => {
        document.body.style.overflowY = 'visible';
        this.setState({
            active: false
        });
    };

    handleClick = () => {
        const { outsideClickEnabled } = this.props;
        const { active } = this.state;

        document.body.style.overflowY = (!active) ? 'hidden' : 'visible';
        this.setState(state => ({ active: !state.active }));

        if (!active && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.handlePopupClose);
        }
    };

    removeProduct = wishlistItemId => () => {
        this.props.deleteFromWishlist(wishlistItemId);
    };

    handleAddToBasket = (product, properties) => () => {
        this.props.saveProductsToBasket({
            productId: product.id,
            properties,
            quantity: 1
        });
    };

    render () {
        const { langMap, lang, wishlist, basket, windowWidth } = this.props;
        const { active } = this.state;
        const text = propOr('wishList', {}, langMap);
        const cartText = propOr('cart', {}, langMap);

        return (
            <div className={styles.wishList}>
                <div className={styles.wishListWrapper} onClick={this.handleClick}>
                    <span className={styles.quantityAll}>{wishlist.length}</span>
                </div>
                <div className={classNames(styles.popupContainer, { [styles.active]: active })}>
                    <div className={styles.cover} onClick={this.handleClick} />
                    <div className={styles.popup}>
                        <p className={styles.title}>
                            {text.title} {wishlist.length > 0 && <span>
                                {wishlist.length}&nbsp;{formatWordDeclension(cartText.product, wishlist.length)}
                            </span>}
                        </p>
                        {wishlist.length > 0
                            ? <div className={styles.productsContainer}>
                                {wishlist.map(({ product, properties, id: wishlistItemId }, i) => {
                                    const size = product.sizes[lang].find(productSize => productSize.id === properties.size.id);
                                    const color = size.colors.find(color => color.id === properties.size.color.id);
                                    const isManyColors = size.colors.length > 1;

                                    return <div className={styles.wishItemWrapper} key={i}>
                                        <div className={styles.wishItem}>
                                            <img className={styles.productImg} src={product.avatar} alt="" />
                                            <div className={styles.productInfo}>
                                                <div>
                                                    <p className={styles.productName}>{product.texts[lang].name.split('« ').join('«').split(' »').join('»')}</p>
                                                    <p className={styles.productNumber}>
                                                        {!!color.article && <span className={styles.productNumberTitle}>{text.article} </span>}
                                                        {color.article}
                                                    </p>
                                                    <p className={styles.productSize}>{`${text.size} ${size.name}`}</p>
                                                    {isManyColors && <div className={styles.productColor}>
                                                        {text.color}
                                                        <div className={styles.productColorImgWrap}>
                                                            <img className={styles.productColorImg} src={color.file} alt={color.name}/>
                                                        </div>
                                                    </div>}
                                                    <div className={styles.productPrices}>
                                                        {color && !!color.discountPrice &&
                                                        <p className={styles.productOldPrice}>
                                                            {formatMoney(color.price)}
                                                        </p>}
                                                        <p className={classNames(styles.productPrice, styles.productDiscountPrice)}>
                                                            {formatMoney(color.discountPrice || color.price)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={styles.productButtons}>
                                                    <button className={styles.removeBtn} onClick={this.removeProduct(wishlistItemId)}>
                                                        <img
                                                            className={styles.removeBtnImg} src="/src/apps/client/ui/components/Header/img/remove.png"
                                                            alt="remove"
                                                        />
                                                    </button>
                                                    {basket.find(item => item.product.id === product.id && item.properties.size.color.id === color.id)
                                                        ? <button className={classNames(styles.cartBtn, styles.inCartBtn)}>
                                                            { windowWidth > 500 ? text.inCartBtn : <img
                                                                className={styles.cartBtnImg} src="/src/apps/client/ui/components/Cart/img/cart.svg"
                                                                alt="cart"
                                                            />}
                                                        </button>
                                                        : <button className={styles.cartBtn} onClick={this.handleAddToBasket(product, properties)}>
                                                            { windowWidth > 500 ? text.cartBtn : <img
                                                                className={styles.cartBtnImg} src="/src/apps/client/ui/components/Cart/img/cart.svg"
                                                                alt="cart"
                                                            />}
                                                        </button>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>;
                                })}
                            </div>
                            : <p className={styles.noProducts}>{text.noProduct}</p>
                        }
                        <button className={styles.continueShopping} onClick={this.handlePopupClose}>{text.continueShopping}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WishList);
