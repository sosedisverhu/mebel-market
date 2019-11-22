import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './Product.css';

import AboutProductTop from '../AboutProductTop/AboutProductTop';
import Gallery from '../Gallery/Gallery';
import AboutProduct from '../AboutProduct/AboutProduct';

class Product extends Component {
    static propTypes = {
        product: PropTypes.object.isRequired
    };

    getDiscount = (priceOld, price) => {
        const discount = Math.round((priceOld - price) / priceOld * 100);
        return `-${discount}%`;
    }

    render () {
        const { product } = this.props;
        const discount = this.getDiscount(product.priceOld, product.price);

        return <div className={styles.product}>
            <AboutProductTop newClass='mobile' product={product} />
            <Gallery discount={discount} photos={product.photos} />
            <AboutProduct product={product} />
        </div>;
    }
}

export default connect()(Product);
