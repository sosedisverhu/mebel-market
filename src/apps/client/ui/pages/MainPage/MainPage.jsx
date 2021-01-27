import React, { Component } from 'react';
import PropTypes from 'prop-types';
import propOr from '@tinkoff/utils/object/propOr';
import includes from '@tinkoff/utils/array/includes';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { MAX_NEW_PROSUCTS } from '../../../constants/constants';

import styles from './MainPage.css';
import Carousel from '../../components/Carousel/Carousel';
import ProductsSlider from '../../components/ProductsSlider/ProductsSlider';
import MainCategories from '../../components/MainCategories/MainCategories';
import Advantages from '../../components/Advantages/Advantages';
import DeliveryOffer from '../../components/DeliveryOffer/DeliveryOffer';

import isScrolledIntoView from '../../../utils/isScrolledIntoView';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        products: data.products,
        labels: data.labels
    };
};

class MainPage extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        labels: PropTypes.array.isRequired,
        products: PropTypes.array.isRequired
    };

    constructor (props) {
        super(props);

        this.state = {
            carouselAnimation: false,
            categoriesAnimation: false,
            advantagesAnimation: false
        };

        this.carousel = React.createRef();
        this.categories = React.createRef();
        this.advantages = React.createRef();
    }

    componentDidMount () {
        this.setState({ isLoading: false },
            this.handleScroll(),
            document.addEventListener('scroll', this.handleScroll)
        );
    }

    componentWillUnmount () {
        document.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        this.isScrolledIntoView(this.carousel.current, 'carouselAnimation');
        this.isScrolledIntoView(this.categories.current, 'categoriesAnimation');
        this.isScrolledIntoView(this.advantages.current, 'advantagesAnimation');
    };

    isScrolledIntoView = (elem, state) => {
        const isVisible = isScrolledIntoView(elem, { offset: 0, full: false });

        if (isVisible) {
            this.setState({
                [state]: true
            });
        }
    };

    render () {
        const { langMap, lang, products, labels } = this.props;
        const { carouselAnimation, categoriesAnimation, advantagesAnimation } = this.state;
        const text = propOr('mainPage', {}, langMap);

        const productsResult = products
            .reduce((result, product) => {
                if (includes('top', product.labels)) {
                    (result.top) ? result.top.push(product) : result.top = [product];
                }

                if (product.sizes[lang].some(size => size.colors.some(color => color.action))) {
                    (result.discount) ? result.discount.push(product) : result.discount = [product];
                }

                if (result.new) {
                    if (result.new.length < MAX_NEW_PROSUCTS) {
                        result.new.push(product);
                    }
                } else {
                    result.new = [product];
                }

                return result;
            }, {});

        return (
            <div>
                <div ref={this.carousel}>
                    <Carousel carouselAnimation={carouselAnimation}/>
                </div>
                <DeliveryOffer mobile/>
                {labels.map((label, i) => {
                    return (
                        <div key={i}>
                            {productsResult[label] &&
                            <section key={label} className={classNames(styles.categorySection, styles[label])}>
                                <h2 className={styles.title}>{text[label]}</h2>
                                <ProductsSlider label={label} isPromotion={label === 'discount'} products={productsResult[label]}/>
                            </section>
                            }
                        </div>);
                })}
                <div ref={this.categories}>
                    <MainCategories categoriesAnimation={categoriesAnimation}/>
                </div>
                <div ref={this.advantages}>
                    <Advantages advantagesAnimation={advantagesAnimation}/>
                </div>
            </div>);
    }
}

export default connect(mapStateToProps)(MainPage);
