import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Card from '../Card/Card';
import styles from './ProductsGrid.css';

class ProductsGrid extends Component {
    static propTypes = {
        products: PropTypes.array.isRequired,
        isPromotion: PropTypes.bool,
        activeSizes: PropTypes.array
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
                    />)}
            </div>
        );
    }
}

export default ProductsGrid;
