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
        subCategory: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        isPromotion: PropTypes.bool
    };

    constructor (props) {
        super(props);
        const { isPromotion } = this.props;
        let activeSize = this.props.product.sizes[this.props.lang][0];
        let activeColor = this.props.product.sizes[this.props.lang][0].colors[0];

        if (isPromotion) {
            const activeSizeIndex = this.props.product.sizes[this.props.lang].findIndex(size => size.colors.some(color => color.action));
            const activeColorIndex = this.props.product.sizes[this.props.lang][activeSizeIndex].colors.findIndex(color => color.action);

            activeSize = this.props.product.sizes[this.props.lang][activeSizeIndex];
            activeColor = this.props.product.sizes[this.props.lang][activeSizeIndex].colors[activeColorIndex];
        }

        this.state = {
            activeSize,
            activeColor
        };
    }

    handleSizeChange = activeSize => {
        const { isPromotion } = this.props;
        let activeColor = activeSize.colors[0];

        if (isPromotion) {
            const activeColorIndex = activeSize.colors.findIndex(color => color.action);

            activeColor = activeSize.colors[activeColorIndex];
        }

        this.setState({ activeSize, activeColor });
    };

    handleColorChange = activeColor => this.setState({ activeColor });

    render () {
        const { product, isPromotion, subCategory } = this.props;
        const { activeSize, activeColor } = this.state;

        return <div className={styles.product}>
            <AboutProductTop newClass='mobile' product={product} article={activeColor.article} />
            <Gallery discount={activeColor.discount} photos={product.files} />
            <AboutProduct
                product={product}
                changeSize={this.handleSizeChange}
                changeColor={this.handleColorChange}
                activeSize={activeSize}
                activeColor={activeColor}
                isPromotion={isPromotion}
                subCategory={subCategory}/>
        </div>;
    }
}

export default connect(mapStateToProps)(Product);
