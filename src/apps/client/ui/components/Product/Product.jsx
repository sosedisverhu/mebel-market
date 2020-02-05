import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AboutProductTop from '../AboutProductTop/AboutProductTop';
import Gallery from '../Gallery/Gallery';
import AboutProduct from '../AboutProduct/AboutProduct';

import styles from './Product.css';

const mapStateToProps = ({ application }) => {
    return {
        lang: application.lang
    };
};

class Product extends Component {
    static propTypes = {
        product: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired
    };

    state = {
        activeSize: this.props.product.sizes[this.props.lang][0],
        activeColor: this.props.product.sizes[this.props.lang][0].colors[0]
    }

    handleSizeChange = activeSize => this.setState({ activeSize, activeColor: activeSize.colors[0] });

    handleColorChange = activeColor => this.setState({ activeColor });

    render () {
        const { product } = this.props;
        const { activeSize, activeColor } = this.state;

        return <div className={styles.product}>
            <AboutProductTop newClass='mobile' product={product} article={activeColor.article} />
            <Gallery discount={activeColor.discount} photos={product.files} />
            <AboutProduct
                product={product}
                changeSize={this.handleSizeChange}
                changeColor={this.handleColorChange}
                activeSize={activeSize}
                activeColor={activeColor} />
        </div>;
    }
}

export default connect(mapStateToProps)(Product);
