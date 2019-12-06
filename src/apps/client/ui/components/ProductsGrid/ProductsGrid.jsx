import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './ProductsGrid.css';
import Card from '../Card/Card';

class ProductsGrid extends Component {
    static propTypes = {
        products: PropTypes.array.isRequired
    };

    render () {
        const { products } = this.props;

        return (
            <div className={styles.products}>
                {products.map(product => <Card key={product.id} product={product} />)}
                {products.map(product => <Card key={product.id} product={product} />)}
            </div>
        );
    }
}

export default connect()(ProductsGrid);
