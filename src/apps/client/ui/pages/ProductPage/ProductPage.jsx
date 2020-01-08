import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { matchPath, withRouter } from 'react-router-dom';

import find from '@tinkoff/utils/array/find';
import isEmpty from '@tinkoff/utils/is/empty';

import NotFoundPage from '../NotFoundPage/NotFoundPage';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Product from '../../components/Product/Product';
import Tab from '../../components/Tab/Tab';
import addProductViews from '../../../services/client/addProductViews';

class ProductPage extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        langMap: PropTypes.object.isRequired,
        langRoute: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired,
        products: PropTypes.array.isRequired,
        categories: PropTypes.array.isRequired,
        subCategories: PropTypes.array.isRequired
    };

    state = {
        category: {},
        subCategory: {},
        product: {},
        didMount: false
    };

    componentDidMount () {
        const { categoryAlias, subCategoryAlias, alias } = this.getMatch();
        const category = this.getCategory(categoryAlias);
        const subCategory = this.getSubCategory(subCategoryAlias, category);
        const product = this.getProduct(alias, category, subCategory);

        this.setState({
            category,
            subCategory,
            product,
            didMount: true
        });

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

    getMatch = () => {
        const { location: { pathname }, langRoute } = this.props;
        const CATEGORY_PATH = `${langRoute}/:categoryAlias/:subCategoryAlias/:alias`;

        return matchPath(pathname, { path: CATEGORY_PATH, exact: true }).params;
    };

    getCategory = (categoryAlias, props = this.props) => {
        return find(category => category.alias === categoryAlias, props.categories);
    };

    getSubCategory = (subCategoryAlias, category, props = this.props) => {
        const subCategories = props.subCategories.filter(subCategory => {
            return subCategory.categoryId === category.id;
        });
        return find(subCategory => subCategory.alias === subCategoryAlias, subCategories);
    };

    getProduct = (alias, category, subCategory, props = this.props) => {
        const products = props.products.filter(product => {
            return (product.categoryId === category.id && product.subCategoryId === subCategory.id);
        });

        return find(product => product.alias === alias, products);
    };

    render () {
        const { category, product, didMount } = this.state;

        if (isEmpty(product) && didMount) {
            return <NotFoundPage/>;
        } else if (!isEmpty(product)) {
            return (
                <div>
                    <Breadcrumbs category={category}/>
                    <Product product={product}/>
                    <Tab product={product}/>
                </div>);
        } else {
            return <div/>;
        }
    }
}

const mapStateToProps = ({ data, application }) => {
    return {
        langMap: application.langMap,
        langRoute: application.langRoute,
        lang: application.lang,
        products: data.products,
        categories: data.categories,
        subCategories: data.subCategories
    };
};

export default withRouter(connect(mapStateToProps)(ProductPage));
