import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import splitEvery from '@tinkoff/utils/array/splitEvery';

import styles from './ProductsSlider.css';
import Card from '../Card/Card';

class ProductsSlider extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        products: PropTypes.array.isRequired
    };

    constructor (props) {
        super(props);
        this.state = {
            width: 0,
            activeIndex: 0,
            productsInPack: 4,
            productsPacks: []
        };
    }

    componentDidMount () {
        const { products } = this.props;
        const width = this.products.clientWidth;
        const widthWindow = window.innerWidth;

        let productsNumber = 4;
        if (widthWindow < 1361) productsNumber = 3;
        if (widthWindow < 1021) productsNumber = 2;
        if (widthWindow < 760) productsNumber = 1; // TODO: переделать через application.media.width

        const productsPacks = splitEvery(productsNumber, products);

        this.setState({ width, productsPacks });
    }

    setActiveIndex = (newIndex) => {
        const { productsPacks } = this.state;
        const length = Math.ceil(productsPacks.length);

        if (newIndex > length - 1) newIndex = 0;
        if (newIndex < 0) newIndex = length - 1;

        this.setState({ activeIndex: newIndex });
    };

    handleArrowClick = (addValue) => {
        const { activeIndex } = this.state;
        this.setActiveIndex(activeIndex + addValue);
    };

    render () {
        const { label } = this.props;
        const { width, activeIndex, productsPacks } = this.state;
        const left = -1 * (width * activeIndex);

        return (
            <div className={classNames(styles.slider, styles[label])}>
                <div className={styles.content}>
                    <div
                        className={styles.products}
                        ref={products => { this.products = products; }}
                        style={{ left }}>
                        {productsPacks.map((products, index) => {
                            return <div key={index} className={styles.productsPack}>
                                {products.map(product => <Card key={product.id} product={product} />)}
                            </div>;
                        })}
                    </div>
                </div>
                <div className={styles.left} onClick={() => this.handleArrowClick(-1)} />
                <div className={styles.right} onClick={() => this.handleArrowClick(1)} />
                <div className={styles.switch}>
                    {productsPacks.map((products, index) => {
                        return (
                            <div
                                key={index}
                                onClick={() => this.setActiveIndex(index)}
                                className={classNames(styles.ellipse, { [styles.active]: index === activeIndex })}>
                            </div>);
                    })}
                </div>
            </div>);
    }
}

export default connect()(ProductsSlider);
