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
        openBasket: (payload) => dispatch(openBasket(payload))
    };
};

class ProductsGrid extends Component {
    static propTypes = {
        products: PropTypes.array.isRequired,
        isPromotion: PropTypes.bool,
        activeSizes: PropTypes.array,
        basketIsOpen: PropTypes.bool.isRequired,
        openBasket: PropTypes.func.isRequired
    };

    constructor (props) {
        super(props);

        this.state = {
            checkedFeatureIds: {}
        };
    }

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
                        sizes = {product.sizes}
                        handleOpenBasket = {this.handleOpenBasket}
                    />)}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsGrid);
