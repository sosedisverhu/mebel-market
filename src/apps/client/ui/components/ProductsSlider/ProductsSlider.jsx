import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import splitEvery from '@tinkoff/utils/array/splitEvery';
import noop from '@tinkoff/utils/function/noop';

import styles from './ProductsSlider.css';
import Card from '../Card/Card';
import Draggable from '../Draggable/Draggable.jsx';

const IGNORE_SWIPE_DISTANCE = 50;

const mapStateToProps = ({ application }) => {
    return {
        widthWindow: application.media.width
    };
};
class ProductsSlider extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        products: PropTypes.array.isRequired,
        widthWindow: PropTypes.number.isRequired,
        isPromotion: PropTypes.bool
    };

    constructor (props) {
        super(props);
        this.products = React.createRef();
        this.state = {
            widthSlide: 0,
            activeIndex: 0,
            productsInPack: 4,
            productsPacks: [],
            left: 0
        };
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.widthWindow !== this.props.widthWindow) {
            this.setWidth();
            this.setProductsPacks(nextProps);
        }
    }

    componentDidMount () {
        this.setWidth();
        this.setProductsPacks();
    }

    setWidth = () => {
        const productsPack = this.products.current.querySelector('div');
        const { activeIndex } = this.state;

        if (!productsPack) return;

        const offsetWidth = productsPack.offsetWidth;
        const productsPackStyle = window.getComputedStyle(productsPack);
        const marginLeft = parseInt(productsPackStyle.getPropertyValue('margin-left'), 10);
        const marginRight = parseInt(productsPackStyle.getPropertyValue('margin-right'), 10);
        const widthSlide = offsetWidth + marginLeft + marginRight;
        const left = -widthSlide * activeIndex;

        this.setState({ widthSlide, left });
    }

    setProductsPacks = (props = this.props) => {
        const { products, widthWindow } = props;

        let productsNumber = 4;
        if (widthWindow < 1361) productsNumber = 3;
        if (widthWindow < 1021) productsNumber = 2;
        if (widthWindow < 761) productsNumber = 4;

        const productsPacks = splitEvery(productsNumber, products);

        if (this.state.activeIndex > productsPacks.length - 1) {
            this.setState({ activeIndex: productsPacks.length - 1 });
        }

        this.setState({ productsPacks, productsInPack: productsNumber });
    }

    setActiveIndex = (newIndex) => {
        const { productsPacks, widthSlide, productsInPack } = this.state;
        const { products, widthWindow } = this.props;
        const length = Math.ceil(productsPacks.length);

        if (newIndex > length - 1) newIndex = 0;
        if (newIndex < 0) newIndex = length - 1;

        const lastSlideIndex = Math.ceil(products.length / productsInPack) - 1;
        const extraProducts = products.length % productsInPack;
        let extraSpace = 0;
        if (newIndex === lastSlideIndex && widthWindow >= 760) {
            extraSpace = widthSlide / productsInPack * extraProducts;
        }


        const left = -widthSlide * newIndex + extraSpace;

        this.setState({ activeIndex: newIndex, left });
    };

    handleArrowClick = (addValue) => {
        const { activeIndex } = this.state;
        this.setActiveIndex(activeIndex + addValue);
    };

    handleDragStart = () => {
        this.startLeft = this.state.left;
    };

    handleDragProcess = ({ delta: { client: { x: deltaX } } }) => {
        this.setState({ left: this.startLeft + deltaX });
    };

    handleDragEnd = ({ delta: { client: { x: deltaX } } }) => {
        const { activeIndex, widthSlide } = this.state;
        let left = -widthSlide * activeIndex;

        if (Math.abs(deltaX) < IGNORE_SWIPE_DISTANCE) {
            this.products.current.style.transition = `left .2s ease-in-out`;
            return this.setState({ left }, () => {
                setTimeout(() => {
                    this.products.current.style.transition = `left .7s ease-in-out`;
                }, 200);
            });
        }

        if (deltaX > 0) return this.setActiveIndex(activeIndex - 1);

        this.setActiveIndex(activeIndex + 1);
    };

    render () {
        const { label, widthWindow, isPromotion } = this.props;
        const { activeIndex, productsPacks, left } = this.state;
        const hidden = productsPacks.length <= 1;

        return (
            <div className={classNames(styles.slider, styles[label])}>
                <div className={styles.content}>
                    <Draggable
                        onDragStart={widthWindow < 1024 ? this.handleDragStart : noop}
                        onDrag={widthWindow < 1024 ? this.handleDragProcess : noop}
                        onDragEnd={widthWindow < 1024 ? this.handleDragEnd : noop}
                        allowDefaultAction
                        touchable
                    >
                        <div
                            className={styles.products}
                            ref={this.products}
                            style={{ left }}>
                            {productsPacks.map((products, index) => {
                                return <div key={index} className={styles.productsPack}>
                                    {products.map(product => <Card
                                        newClass='sliderProduct'
                                        labelClass={label}
                                        key={product.id}
                                        product={product}
                                        isPromotion={isPromotion}
                                        setSliderWidth={this.setWidth}/>)}
                                </div>;
                            })}
                        </div>
                    </Draggable>
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
