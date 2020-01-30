import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AboutProductTop from '../AboutProductTop/AboutProductTop';
import Gallery from '../Gallery/Gallery';
import AboutProduct from '../AboutProduct/AboutProduct';

import styles from './Product.css';

class Product extends Component {
    static propTypes = {
        product: PropTypes.object.isRequired
    };

    state = {
        activeSize: this.props.product.sizes[0]
    }

    handleSizeChange = (activeSize) => this.setState({ activeSize });

    render () {
        const { product } = this.props;
        const { activeSize } = this.state;

        return <div className={styles.product}>
            <AboutProductTop newClass='mobile' product={product} />
            <Gallery discount={activeSize.discount} photos={product.files} />
            <AboutProduct product={product} changeGalleryDiscount={this.handleSizeChange} />
        </div>;
    }
}

export default Product;
