import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import splitEvery from '@tinkoff/utils/array/splitEvery';

import isScrolledIntoView from './../../../utils/isScrolledIntoView';

import styles from './ProductsSlider.css';
import Card from '../Card/Card';

const mapStateToProps = ({ application }) => {
    return {
        widthWindow: application.media.width
    };
};
class ProductsSlider extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        products: PropTypes.array.isRequired,
        widthWindow: PropTypes.number.isRequired
    };

    constructor (props) {
        super(props);
        this.products = React.createRef();
        this.state = {
            width: 0,
            activeIndex: 0,
            productsInPack: 4,
            productsPacks: [],
            productsAnimation: false,
            endAnimation: false
        };
    }

    componentDidMount () {
        const { products, widthWindow } = this.props;
        const width = this.products.current.clientWidth;

        let productsNumber = 4;
        if (widthWindow < 1361) productsNumber = 3;
        if (widthWindow < 1021) productsNumber = 2;
        if (widthWindow < 761) productsNumber = 4;

        const productsPacks = splitEvery(productsNumber, products);

        this.setState({ width, productsPacks });

        if (document.readyState === 'complete') {
            this.handleScroll();
            document.addEventListener('scroll', this.handleScroll);
        } else {
            window.addEventListener('load', () => {
                this.handleScroll();
                document.addEventListener('scroll', this.handleScroll);
            });
        }
    }

    componentWillUnmount () {
        document.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        this.isScrolledIntoView(this.products.current, 'productAnimation');
    };

    isScrolledIntoView = (elem, stateName) => {
        if (this.state[stateName]) {
            return;
        }

        const isVisible = isScrolledIntoView(elem);

        if (isVisible) {
            this.setState({ [stateName]: true }, () => {
                setTimeout(() => stateName === 'productAnimation' ? this.setState({ endAnimation: true }) : null);
            });
        }
    };

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
        const { width, activeIndex, productsPacks, productAnimation, endAnimation } = this.state;
        const left = -1 * (width * activeIndex);
        const hidden = productsPacks.length <= 1;

        return (
            <div className={classNames(styles.slider, styles[label])}>
                <div className={styles.content}>
                    <div
                        className={styles.products}
                        ref={this.products}
                        style={{ left }}>
                        {productsPacks.map((products, index) => {
                            return <div key={index} className={styles.productsPack}>
                                {products.map((product, index) => {
                                    return <Card
                                        newClass='sliderProduct'
                                        sliderProductVisible={productAnimation}
                                        labelClass={label}
                                        key={product.id}
                                        transitionDelay={index}
                                        endAnimation={endAnimation}
                                        product={product} />;
                                })}
                            </div>;
                        })}
                    </div>
                </div>
                <div className={classNames(styles.left, { [styles.hidden]: hidden })} onClick={() => this.handleArrowClick(-1)} />
                <div className={classNames(styles.right, { [styles.hidden]: hidden })} onClick={() => this.handleArrowClick(1)} />
                <div className={classNames(styles.switch, { [styles.hidden]: hidden })}>
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

export default connect(mapStateToProps)(ProductsSlider);
