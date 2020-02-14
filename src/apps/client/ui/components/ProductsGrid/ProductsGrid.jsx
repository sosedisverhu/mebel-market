import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Card from '../Card/Card';
import styles from './ProductsGrid.css';

class ProductsGrid extends Component {
    static propTypes = {
        products: PropTypes.array.isRequired,
        isPromotion: PropTypes.bool
    };

    render () {
        const { products, isPromotion } = this.props;

        return (
            <div className={styles.products}>
                {products.map(product => <Card isPromotion={isPromotion} key={product.id} product={product} />)}
            </div>
        );
    }
}

export default (ProductsGrid);
