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

class Cart extends Component {
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
        deleteFromWishlist: PropTypes.func.isRequired
    };

    static defaultProps = {
        wishlist: []
    };

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

    render () {
        const { langRoute, langMap, lang, quantity, product, properties, basketItemId, newClass } = this.props;
        const { isInWishList } = this.state;
        const text = propOr('cart', {}, langMap);
        const size = product.sizes[lang].find(productSize => productSize.id === properties.size.id);
        const color = size.colors.find(color => color.id === properties.size.color.id);
        const isDiscount = !!color.discountPrice;

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
                    <img className={styles.productImg} src={product.avatar} alt=''/>
                </Link>
                <div className={styles.productInfo}>
                    <div>
                        <div className={styles.productOption}>
                            <Link
                                className={styles.productNameLink}
                                to={`${langRoute}/${this.getCategoriesAlias(product.categoryId, product.subCategoryId)}/${product.alias}`}
                                onClick={this.handlePopupClose}>
                                <p className={styles.productName}>
                                    {product.texts[lang].name}
                                </p>
                            </Link>
                            <p className={styles.productNumber}>({color.article})</p>
                        </div>
                        <div className={styles.properties}>
                            <p className={styles.productSize}>
                                {text.size} {size.name}
                            </p>
                            <div className={styles.productColor}>
                                {text.color}
                                <div className={styles.productColorImgWrap}>
                                    <img className={styles.productColorImg} src={color.file} alt={color.name}/>
                                </div>
                            </div>
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
                            onClick={this.handleAddToWishlist}/>
                        <button className={styles.removeBtn}
                            type="button"
                            onClick={this.removeProduct(basketItemId)}/>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
