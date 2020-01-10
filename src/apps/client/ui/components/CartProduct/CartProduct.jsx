import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import propOr from '@tinkoff/utils/object/propOr';
import find from '@tinkoff/utils/array/find';
import { MAX_QUANTITY } from '../../../constants/constants';
import styles from './CartProduct.css';

import deleteFromBasket from '../../../services/client/deleteFromBasket';
import saveProductsToWishlist from '../../../services/client/saveProductsToWishlist';
import editProductInBasket from '../../../services/client/editProductInBasket';

import closeBasket from '../../../actions/closeBasket';
import formatMoney from '../../../utils/formatMoney';

const mapStateToProps = ({ application, data }) => {
    return {
        langRoute: application.langRoute,
        langMap: application.langMap,
        lang: application.lang,
        categories: data.categories,
        subCategories: data.subCategories
    };
};

const mapDispatchToProps = (dispatch) => ({
    deleteFromBasket: payload => dispatch(deleteFromBasket(payload)),
    saveProductsToWishlist: payload => dispatch(saveProductsToWishlist(payload)),
    editProductInBasket: payload => dispatch(editProductInBasket(payload)),
    closeBasket: (payload) => dispatch(closeBasket(payload))
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
        properties: PropTypes.array.isRequired

    };

    handlePopupClose = () => {
        document.body.style.overflowY = 'visible';
        this.props.closeBasket();
    }

    quantityChange = value => {
        if (value >= 0 && value <= MAX_QUANTITY) {
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

    handleAddToWishlist = product => () => {
        this.props.saveProductsToWishlist({
            productId: product.id
        });
    }

    getCategoriesAlias = (categoryId, subCategoryId) => {
        const { categories, subCategories } = this.props;
        const category = find(category => category.id === categoryId, categories).alias;
        const subCategory = find(subCategory => subCategory.id === subCategoryId, subCategories).alias;

        return `${category}/${subCategory}`;
    }

    render () {
        const { langRoute, langMap, lang, quantity, product, properties, basketItemId, newClass } = this.props;
        const text = propOr('cart', {}, langMap);

        return <div className={classNames(styles.cartItemWrapper, { [styles[newClass]]: newClass })}>
            <div className={styles.cartItem}>
                <Link
                    className={styles.productImgLink}
                    to={`${langRoute}/${this.getCategoriesAlias(product.categoryId, product.subCategoryId)}/${product.alias}`}
                    onClick={this.handlePopupClose}>
                    <img className={styles.productImg} src={product.avatar} alt="" />
                </Link>
                <div className={styles.productInfo}>
                    <div className={styles.productOptionWrap}>
                        <div className={styles.productOption}>
                            <Link
                                className={styles.productNameLink}
                                to={`${langRoute}/${this.getCategoriesAlias(product.categoryId, product.subCategoryId)}/${product.alias}`}
                                onClick={this.handlePopupClose}>
                                <p className={styles.productName}>{product.texts[lang].name}</p>
                            </Link>
                            <p className={styles.productNumber}>(48092)</p>
                        </div>
                        <p className={styles.productSize}>{text.size} {properties.size.name}</p>
                        <div className={styles.productQuantity}>
                            <button
                                type="button"
                                className={styles.quantitySub}
                                onClick={() => this.quantityChange(+quantity - 1)}
                                disabled={quantity <= 1}>-</button>
                            <input
                                className={styles.quantityInput}
                                type="text"
                                onChange={(e) => this.quantityChange(e.target.value.replace(/\D/, ''))}
                                value={quantity}
                                onBlur={(e) => (e.target.value === '' || +e.target.value === 0) && this.quantityChange(1)}
                            />
                            <button
                                type="button"
                                className={styles.quantityAdd}
                                onClick={() => this.quantityChange(+quantity + 1)}
                                disabled={quantity >= MAX_QUANTITY}>+</button>
                        </div>
                        <div className={styles.productPrices}>
                            {product.discountPrice && <p className={styles.productOldPrice}>{formatMoney(product.price)}</p>}
                            <p className={styles.productPrice}>{formatMoney(product.discountPrice ? product.discountPrice : product.price)}</p>
                        </div>
                    </div>
                    <div>
                        <button type="button" className={styles.wishBtn} onClick={this.handleAddToWishlist(product)} />
                        <button type="button" className={styles.removeBtn} onClick={this.removeProduct(basketItemId)} />
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
