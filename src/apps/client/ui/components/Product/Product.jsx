import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Product.css';

import AboutProductTop from '../AboutProductTop/AboutProductTop';
import Gallery from '../Gallery/Gallery';
import AboutProduct from '../AboutProduct/AboutProduct';

class Product extends Component {
    static propTypes = {
        product: PropTypes.object.isRequired
    };

    render () {
        const { product } = this.props;

        return <div className={styles.product}>
            <AboutProductTop newClass='mobile' product={product} />
            <Gallery discount={product.discount} photos={product.files} />
            <AboutProduct product={product} />
        </div>;
    }
}

export default (Product);
