import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { matchPath, withRouter } from 'react-router-dom';

import find from '@tinkoff/utils/array/find';

import NotFoundPage from '../NotFoundPage/NotFoundPage';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import DeliveryOffer from '../../components/DeliveryOffer/DeliveryOffer.jsx';
import Product from '../../components/Product/Product';
import Tab from '../../components/Tab/Tab';
import addProductViews from '../../../services/client/addProductViews';

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
            isPromotion
        };
    }

    componentDidMount () {
        const { product } = this.state;

        product && addProductViews(product.id);
    };

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
        const { category, subCategory, product, isPromotion } = this.state;

        if (!product) return <NotFoundPage/>;

        return (
            <div>
                <Breadcrumbs category={category || {}} subCategory={subCategory || {}} product={product}/>
                <DeliveryOffer mobile/>
                <Product isPromotion={isPromotion} product={product} subCategory={subCategory}/>
                <Tab product={product}/>
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
