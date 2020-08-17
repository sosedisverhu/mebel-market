import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';
import find from '@tinkoff/utils/array/find';
import { MAX_QUANTITY } from '../../../constants/constants';

import deleteFromBasket from '../../../services/client/deleteFromBasket';
import saveProductsToWishlist from '../../../services/client/saveProductsToWishlist';
import editProductInBasket from '../../../services/client/editProductInBasket';
import deleteFromWishlist from '../../../services/client/deleteFromWishlist';

import closeBasket from '../../../actions/closeBasket';
import formatMoney from '../../../utils/formatMoney';
import getShareTypeQuantity from '../../../utils/getShareTypeQuantity';
import outsideClick from '../../hocs/outsideClick';

import styles from './CartProduct.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langRoute: application.langRoute,
        langMap: application.langMap,
        lang: application.lang,
        categories: data.categories,
        subCategories: data.subCategories,
        wishlist: data.wishlist
    };
};

const mapDispatchToProps = dispatch => ({
    deleteFromBasket: payload => dispatch(deleteFromBasket(payload)),
    saveProductsToWishlist: payload => dispatch(saveProductsToWishlist(payload)),
    editProductInBasket: payload => dispatch(editProductInBasket(payload)),
    closeBasket: (payload) => dispatch(closeBasket(payload)),
    deleteFromWishlist: (payload) => dispatch(deleteFromWishlist(payload))
});

@outsideClick
class CartProduct extends Component {
    static propTypes = {
        langRoute: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        deleteFromBasket: PropTypes.func.isRequired,
        saveProductsToWishlist: PropTypes.func.isRequired,
        categories: PropTypes.array,
        subCategories: PropTypes.array,
        closeBasket: PropTypes.func.isRequired,
        editProductInBasket: PropTypes.func.isRequired,
        newClass: PropTypes.string,
        basketItemId: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        product: PropTypes.object.isRequired,
        properties: PropTypes.object.isRequired,
        wishlist: PropTypes.array.isRequired,
        deleteFromWishlist: PropTypes.func.isRequired,
        shares: PropTypes.array,
        turnOnClickOutside: PropTypes.func,
        outsideClickEnabled: PropTypes.bool
    };

    static defaultProps = {
        wishlist: [],
        shares: []
    };

    constructor (props) {
        super(props);

        this.state = {
            isPresentMessage: false,
            isDiscountMessage: false
        };

        this.sharePresent = React.createRef();
        this.shareDiscount = React.createRef();
    }

    static getDerivedStateFromProps (props) {
        const { wishlist, product, properties } = props;

        return wishlist.find(item => item.product.id === product.id && item.properties.size.color.id === properties.size.color.id)
            ? { isInWishList: true }
            : { isInWishList: false };
    }

    componentDidMount () {
        const { product, wishlist, properties } = this.props;

        this.setState({
            isInWishList: wishlist.some(item => {
                return item.product.id === product.id && item.properties.size.color.id === properties.size.color.id;
            })
        });
    }

    handlePopupClose = () => {
        document.body.style.overflowY = 'visible';
        this.props.closeBasket();
    };

    quantityChange = value => {
        if ((value >= 0 && value <= MAX_QUANTITY) || value === '') {
            const { basketItemId, editProductInBasket } = this.props;
            editProductInBasket({
                quantity: value,
                basketItemId: basketItemId
            });
        }
    };

    removeProduct = basketItemId => () => {
        this.props.deleteFromBasket(basketItemId);
    };

    handleAddToWishlist = () => {
        const { product, properties, saveProductsToWishlist, deleteFromWishlist, wishlist } = this.props;
        const { isInWishList } = this.state;

        if (!isInWishList) {
            saveProductsToWishlist({
                productId: product.id,
                properties
            });
        } else {
            const wishlistItem = wishlist.find(el => el.product.id === product.id && el.properties.size.color.id === properties.size.color.id);

            if (wishlistItem) {
                deleteFromWishlist(wishlistItem.id);
            }
        }
    };

    getCategoriesAlias = (categoryId, subCategoryId) => {
        const { categories, subCategories } = this.props;
        const category = find(category => category.id === categoryId, categories).alias;
        const subCategory = find(subCategory => subCategory.id === subCategoryId, subCategories).alias;

        return `${category}/${subCategory}`;
    };

    handleShowPresentMessage = () => {
        const { isPresentMessage } = this.state;
        const { outsideClickEnabled, turnOnClickOutside } = this.props;

        if (isPresentMessage) {
            return this.closeMessage();
        }

        this.setState({ isPresentMessage: true });
        !outsideClickEnabled && turnOnClickOutside(this.sharePresent.current, () => this.closeMessage('isPresentMessage'));
    };

    handleShowDiscountMessage = () => {
        const { isDiscountMessage } = this.state;
        const { outsideClickEnabled, turnOnClickOutside } = this.props;

        if (isDiscountMessage) {
            return this.closeMessage();
        }

        this.setState({ isDiscountMessage: true });
        !outsideClickEnabled && turnOnClickOutside(this.shareDiscount.current, () => this.closeMessage('isDiscountMessage'));
    };

    closeMessage = (messageName) => {
        this.setState({ [messageName]: false });
    };

    render () {
        const { langRoute, langMap, lang, quantity, product, properties, basketItemId, newClass, shares } = this.props;
        const { isInWishList, isPresentMessage, isDiscountMessage } = this.state;
        const text = propOr('cart', {}, langMap);
        const isExist = propOr('exist', 'true', product);
        const size = product.sizes[lang].find(productSize => productSize.id === properties.size.id);
        const color = size.colors.find(color => color.id === properties.size.color.id);
        const isDiscount = !!color.discountPrice;
        const presentsQuantity = getShareTypeQuantity(shares, product.id, 'present');
        const discountsQuantity = getShareTypeQuantity(shares, product.id, 'discount');
        const allFeatures = size.features || [];
        const checkedFeatureIds = properties.features || {};
        const checkedFeatures = allFeatures.filter(feature => checkedFeatureIds[feature.id]);
        const featuresPrice = checkedFeatures.reduce((sum, { value }) => sum + value, 0);
        const resultPrice = (color.discountPrice || color.price) + featuresPrice;

        return <div className={classNames(styles.cartItemWrapper, { [styles[newClass]]: newClass })}>
            <div className={styles.cartItem}>
                <Link
                    className={styles.productImgLink}
                    to={`${langRoute}/${this.getCategoriesAlias(product.categoryId, product.subCategoryId)}/${product.alias}`}
                    onClick={this.handlePopupClose}
                >
                    <img className={styles.productImg} src={product.avatar} alt='' />
                </Link>
                <div className={styles.productInfo}>
                    <div>
                        {!!presentsQuantity && <div ref={this.sharePresent} className={classNames(
                            styles.share,
                            { [styles.active]: isPresentMessage }
                        )} onClick={this.handleShowPresentMessage}>
                            {text.present}
                            {presentsQuantity < quantity && <span>&nbsp;{`(${presentsQuantity} ${text.of} ${quantity})`}</span>}
                            <div className={styles.shareInfo}>
                                <div className={styles.shareInfoMessage}>{text.presentDescription}</div>
                                <span className={styles.shareInfoIcon}/>
                            </div>
                        </div>}
                        {!!discountsQuantity && <div ref={this.shareDiscount} className={classNames(
                            styles.share,
                            { [styles.active]: isDiscountMessage }
                        )} onClick={this.handleShowDiscountMessage}>
                            {text.discount}
                            {discountsQuantity < quantity && <span>&nbsp;{`(${discountsQuantity} ${text.of} ${quantity})`}</span>}
                            <div className={styles.shareInfo}>
                                <div className={styles.shareInfoMessage}>{text.discountDescription}</div>
                                <span className={styles.shareInfoIcon}/>
                            </div>
                        </div>}
                        <div className={styles.productOption}>
                            <Link
                                className={styles.productNameLink}
                                to={`${langRoute}/${this.getCategoriesAlias(product.categoryId, product.subCategoryId)}/${product.alias}`}
                                onClick={this.handlePopupClose}>
                                <p className={styles.productName}>
                                    {product.texts[lang].name}
                                </p>
                            </Link>
                            {!!color.article && <p className={styles.productNumber}>({color.article})</p>}
                        </div>
                        <div className={styles.properties}>
                            <p className={styles.productSize}>
                                {text.size} {size.name}
                            </p>
                        </div>
                        {checkedFeatures && <div className={styles.features}>
                            {checkedFeatures.map(feature => <p className={styles.feature}>{`+ ${feature.name}`}</p>)}
                        </div>}

                        <div className={styles.productQuantity}>
                            <button
                                type='button'
                                className={styles.quantitySub}
                                onClick={() => this.quantityChange(+quantity - 1)}
                                disabled={quantity <= 1}>-
                            </button>
                            <input
                                className={styles.quantityInput}
                                type='text'
                                onChange={e => this.quantityChange(e.target.value.replace(/\D/, ''))}
                                value={quantity !== null ? quantity : ''}
                                onBlur={e => (e.target.value === '' || +e.target.value === 0) && this.quantityChange(1)}
                            />
                            <span className={styles.quantityValue}>
                                {quantity}
                            </span>
                            <button
                                type='button'
                                className={styles.quantityAdd}
                                onClick={() => this.quantityChange(+quantity + 1)}
                                disabled={quantity >= MAX_QUANTITY}>+
                            </button>
                        </div>
                        <div className={classNames(styles.existText, { [styles.notExist]: isExist === 'false' })}>
                            {isExist === 'true' ? langMap.exist.inStock : langMap.exist.order}
                        </div>

                        <div className={styles.productPrices}>
                            {isDiscount &&
                                <p className={styles.productOldPrice}>{formatMoney(color.price)}</p>}
                            <p className={classNames(styles.productPrice, styles.productDiscountPrice)}>
                                {formatMoney(resultPrice)}
                            </p>
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <button className={classNames(styles.wishBtn, { [styles.activeWishBtn]: isInWishList })}
                            type="button"
                            onClick={this.handleAddToWishlist} />
                        <button className={styles.removeBtn}
                            type="button"
                            onClick={this.removeProduct(basketItemId)} />
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartProduct);
