import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Card from '../Card/Card';
import styles from './ProductsGrid.css';

import openBasket from '../../../actions/openBasket';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        langRoute: application.langRoute,
        lang: application.lang,
        wishlist: data.wishlist,
        basket: data.basket,
        products: data.products,
        categories: data.categories,
        subCategories: data.subCategories,
        basketIsOpen: data.basketIsOpen
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setScrollToCharacteristic: payload => dispatch(setScrollToCharacteristic(payload)),
        saveProductsToWishlist: payload => dispatch(saveProductsToWishlist(payload)),
        saveProductsToBasket: payload => dispatch(saveProductsToBasket(payload)),
        deleteFromWishlist: payload => dispatch(deleteFromWishlist(payload)),
        openBasket: (payload) => dispatch(openBasket(payload))
    };
};

class ProductsGrid extends Component {
    static propTypes = {
        products: PropTypes.array.isRequired,
        isPromotion: PropTypes.bool,
        activeSizes: PropTypes.array,
        basketIsOpen: PropTypes.bool.isRequired,
        openBasket: PropTypes.func.isRequired,
    };

    constructor (props) {
        super(props);

        this.state = {
            isInBasket: false,
            checkedFeatureIds: {},
        }
    }

    handleBuyClickOnCard = () => {
        const { product } = this.props;
        const { checkedFeatureIds } = this.state;
        const activeSize = "Prduct.jsx constructor";
        const activeColor = "Prduct.jsx constructor";
        const sharesPresent = activeSize.shares && activeSize.shares.filter(share => share.type === 'present');

        if (sharesPresent && sharesPresent.length) {
            this.openPopupPresents();
            return;
        }

        this.saveProductToBasket(product.id, activeSize, activeColor, checkedFeatureIds);
    };

    handleOpenBasket = () => {
        const { basketIsOpen, openBasket } = this.props;

        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        document.body.style.overflowY = (!basketIsOpen) ? 'hidden' : 'visible';
        openBasket();
    };

    render () {
        const { products, isPromotion, activeSizes } = this.props;

        return (
            <div className={styles.products}>
                {products.map(product =>
                    <Card
                        isPromotion={isPromotion}
                        key={product.id}
                        product={product}
                        activeSizes = {activeSizes}
                        handleOpenBasket = {this.handleOpenBasket}
                        handleBuyClick = {this.handleBuyClickOnCard}
                    />)}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsGrid);