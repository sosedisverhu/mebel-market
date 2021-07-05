import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { matchPath, withRouter } from 'react-router-dom';

import find from '@tinkoff/utils/array/find';
import propOr from '@tinkoff/utils/object/propOr';

import ProductsSlider from '../../components/ProductsSlider/ProductsSlider';

import NotFoundPage from '../NotFoundPage/NotFoundPage';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import DeliveryOffer from '../../components/DeliveryOffer/DeliveryOffer.jsx';
import Product from '../../components/Product/Product';
import Tab from '../../components/Tab/Tab';
import addProductViews from '../../../services/client/addProductViews';

import isScrolledIntoView from '../../../utils/isScrolledIntoView';

import styles from './ProductPage.css';
import classNames from 'classnames';
import { FEATURE_TYPES } from '../../../../admin/constants/constants';

const PATH_NAME_REGEX = /\/promotions\/*/;

class ProductPage extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        langRoute: PropTypes.string.isRequired,
        products: PropTypes.array.isRequired,
        categories: PropTypes.array.isRequired,
        subCategories: PropTypes.array.isRequired
    };

    constructor (props) {
        super(props);
        const { location: { pathname } } = this.props;
        const isPromotion = PATH_NAME_REGEX.test(pathname);
        const { categoryAlias, subCategoryAlias, alias } = this.getMatch(isPromotion);
        const category = this.getCategory(categoryAlias);
        const subCategory = this.getSubCategory(subCategoryAlias, category);
        const product = this.getProduct(alias, category, subCategory, isPromotion);

        this.state = {
            category,
            subCategory,
            product,
            isPromotion,
            productAnimation: false,
            infoAnimation: false,
            sliderAnimation: false
        };

        this.product = React.createRef();
        this.info = React.createRef();
        this.slider = React.createRef();
    }

    handleScroll = () => {
        this.isScrolledIntoView(this.product.current, 'productAnimation');
        this.isScrolledIntoView(this.info.current, 'infoAnimation');
        this.isScrolledIntoView(this.slider.current, 'sliderAnimation');
    };

    isScrolledIntoView = (elem, state) => {
        const isVisible = isScrolledIntoView(elem, { offset: 200, full: false });

        if (isVisible) {
            this.setState({
                [state]: true
            });
        }
    };

    componentDidMount () {
        const { product } = this.state;

        product && addProductViews(product.id);

        this.handleScroll();
        document.addEventListener('scroll', this.handleScroll);
    };

    componentWillUnmount () {
        document.removeEventListener('scroll', this.handleScroll);
    }

    componentDidUpdate (prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            const { categoryAlias, subCategoryAlias, alias } = this.getMatch();
            const category = this.getCategory(categoryAlias);
            const subCategory = this.getSubCategory(subCategoryAlias, category);
            const product = this.getProduct(alias, category, subCategory);
            this.setState({
                category,
                subCategory,
                product
            });
        }
    }

    getMatch = (isPromotion = this.state.isPromotion) => {
        const { location: { pathname }, langRoute } = this.props;
        const CATEGORY_PATH = isPromotion
            ? `${langRoute}/promotions/:alias`
            : `${langRoute}/:categoryAlias/:subCategoryAlias/:alias`;

        return matchPath(pathname, { path: CATEGORY_PATH, exact: true }).params;
    };

    getCategory = (categoryAlias, props = this.props) => {
        if (!categoryAlias) return;
        return find(category => category.alias === categoryAlias, props.categories);
    };

    getSubCategory = (subCategoryAlias, category, props = this.props) => {
        if (!subCategoryAlias || !category) return;
        const subCategories = props.subCategories.filter(subCategory => {
            return subCategory.categoryId === category.id;
        });
        return find(subCategory => subCategory.alias === subCategoryAlias, subCategories);
    };

    getProduct = (alias, category, subCategory, isPromotion = this.state.isPromotion, props = this.props) => {
        const { lang } = props;
        let products = props.products;

        if (isPromotion) {
            products = products.filter(product => product.sizes[lang].some(size => size.colors.some(color => color.action)));
        }

        if (category && subCategory) {
            products = products.filter(product => {
                return (product.categoryId === category.id && product.subCategoryId === subCategory.id);
            });
        }

        return find(product => product.alias === alias, products);
    };

    render () {
        const { category, subCategory, product, isPromotion, sliderAnimation, infoAnimation, productAnimation } = this.state;
        const { langMap, lang } = this.props;
        const similarProducts = this.props.products.filter(item => (
            item.categoryId === this.state.product.categoryId &&
            item.subCategoryId === this.state.product.subCategoryId &&
            item.id !== this.state.product.id
        ));
        const text = propOr('product', {}, langMap);

        if (!product) return <NotFoundPage/>;
        console.log(product);
        return (
            <div>
                <Breadcrumbs category={category || {}} subCategory={subCategory || {}} product={product}/>
                <DeliveryOffer mobile productPage={true}/>
                <div ref={this.product}>
                    <Product isPromotion={isPromotion} product={product} subCategory={subCategory} productAnimation={productAnimation}/>
                    {
                        product.features &&
                        <div>
                            <div className={classNames(styles.featuresContainer, {
                                [styles.animated]: productAnimation
                            })}>
                                <div className={styles.title}>{text.features}</div>
                                {product.features && product.features[lang].features.map((feature) => {
                                    return <div className={styles.featureBlock}>
                                        <img src={FEATURE_TYPES[feature.featureType].photo} alt="icon"/>
                                        <div className={styles.featureText}>
                                            <p className={styles.featureTitle}>
                                                {feature.name}
                                            </p>
                                            <p className={styles.featureDescription}>
                                                {feature.value}
                                            </p>
                                        </div>
                                    </div>;
                                })}
                            </div>
                        </div>
                    }
                </div>
                <div ref={this.info}>
                    <Tab product={product} infoAnimation={infoAnimation}/>
                </div>
                <section ref={this.slider} className={classNames(styles.slider, {
                    [styles.animated]: sliderAnimation
                })}>
                    {similarProducts.length ? <p className={styles.sliderTitle}>{text.similarProducts}</p> : undefined}
                    <div className={styles.sliderWrapper}>
                        <ProductsSlider products={similarProducts}/>
                    </div>
                </section>
            </div>);
    }
}

const mapStateToProps = ({ data, application }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        langRoute: application.langRoute,
        products: data.products,
        categories: data.categories,
        subCategories: data.subCategories
    };
};

export default withRouter(connect(mapStateToProps)(ProductPage));
