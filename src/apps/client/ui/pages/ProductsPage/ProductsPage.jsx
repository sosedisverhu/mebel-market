import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter, matchPath, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import find from '@tinkoff/utils/array/find';
import propOr from '@tinkoff/utils/object/propOr';
import flatten from '@tinkoff/utils/array/flatten';
import compose from '@tinkoff/utils/function/compose';
import uniq from '@tinkoff/utils/array/uniq';
import map from '@tinkoff/utils/array/map';
import filterUtil from '@tinkoff/utils/array/filter';
import any from '@tinkoff/utils/array/any';
import prop from '@tinkoff/utils/object/prop';
import reduceObj from '@tinkoff/utils/object/reduce';
import includes from '@tinkoff/utils/array/includes';
import isEmpty from '@tinkoff/utils/is/empty';

import getMinOfArray from '../../../utils/getMinOfArray';
import getMaxOfArray from '../../../utils/getMaxOfArray';
import formatWordDeclension from '../../../utils/formatWordDeclension';

import NotFoundPage from '../NotFoundPage/NotFoundPage';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Filters from '../../components/Filters/Filters';
import ProductFilters from '../../components/ProductFilters/ProductFilters';
import ProductsGrid from '../../components/ProductsGrid/ProductsGrid';
import styles from './ProductsPage.css';

const DEFAULT_FILTERS = name => {
    return [
        {
            name: name,
            type: 'range',
            min: 0,
            max: 0,
            id: 'actualPrice',
            prop: 'actualPrice'
        }
    ];
};

class ProductsPage extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        langMap: PropTypes.object.isRequired,
        langRoute: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired,
        products: PropTypes.array,
        categories: PropTypes.array,
        subCategories: PropTypes.array
    };

    static defaultProps = {
        products: [],
        categories: [],
        subCategories: []
    };

    state = {
        products: [],
        category: {},
        subCategory: {},
        subCategories: [],
        isCategory: true,
        isSubCategoryFilters: false,
        filters: [],
        filteredProducts: null,
        filtersMap: {},
        currentCategoryFiltersName: 'categoryFilters'
    };

    componentDidMount () {
        this.setNewState();
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.setNewState(nextProps);
        }
    }

    setNewState = (props = this.props) => {
        const { subCategoryAlias, categoryAlias } = this.getMatch(props);
        const category = this.getCategory(props);
        if (!category) {
            this.setState({
                isCategory: false
            });
            return;
        }
        const subCategory = subCategoryAlias && this.getSubCategory(props);
        const isPromotionsPage = categoryAlias === 'promotions';

        if (subCategoryAlias && !subCategory && !isPromotionsPage) {
            this.setState({
                isCategory: false
            });
            return;
        }

        const { subCategories, langMap } = props;
        const products = this.getFilteredProducts(subCategoryAlias, category, subCategory, isPromotionsPage);
        const isSubCategoryFilters = !!subCategoryAlias;
        const currentCategory = isSubCategoryFilters ? subCategory : category;

        const filters = currentCategory ? flatten([
            this.getDefaultFilters(products, langMap),
            this.getFilters(currentCategory, products, isSubCategoryFilters)
        ]) : this.getDefaultFilters(products, langMap);

        this.setState({
            products,
            category,
            subCategory,
            subCategories: !isPromotionsPage ? subCategories.filter(subCategory => subCategory.categoryId === category.id) : [],
            isCategory: true,
            isSubCategoryFilters,
            filters,
            filteredProducts: null,
            isPromotionsPage
        });
    };

    getMatch = (props = this.props) => {
        const { location: { pathname }, langRoute } = props;
        let subCategoryAlias = '';

        if (pathname.replace(langRoute, '').split('').filter(symbol => symbol === '/').length >= 2) {
            subCategoryAlias = '/:subCategoryAlias';
        }
        if (pathname.replace(langRoute, '').split('').filter(symbol => symbol === '/').length === 2 && pathname[pathname.length - 1] === '/') {
            subCategoryAlias = '';
        }

        const CATEGORY_PATH = `${langRoute}/:categoryAlias${subCategoryAlias}`;

        return matchPath(pathname, { path: CATEGORY_PATH, exact: true }).params;
    };

    getCategory = (props = this.props) => {
        const { categoryAlias } = this.getMatch(props);

        return find(category => category.alias === categoryAlias, props.categories);
    };

    getSubCategory = (props = this.props) => {
        const { subCategoryAlias } = this.getMatch(props);
        const category = this.getCategory(props);

        return find(subCategory => (subCategory.categoryId === category.id && subCategory.alias === subCategoryAlias), props.subCategories);
    };

    getFilteredProducts = (subCategoryAlias, category, subCategory, isPromotionsPage, props = this.props) => {
        const { products } = props;

        if (!isPromotionsPage) {
            const filteredProductsByCategory = products.filter(product => product.categoryId === category.id);

            return subCategoryAlias ? filteredProductsByCategory.filter(product => product.subCategoryId === subCategory.id)
                : filteredProductsByCategory;
        }
        return products.filter(product => !isEmpty(product.discountPrice) && product.discountPrice !== product.price);
    };

    getDefaultFilters = (products, langMap) => {
        const text = propOr('productsPage', {}, langMap);
        return DEFAULT_FILTERS(text.price).reduce((filters, filter) => {
            switch (filter.type) {
            case 'range':
                const prices = compose(
                    uniq,
                    map(product => product.actualPrice)
                )(products);

                const min = getMinOfArray(prices);
                const max = getMaxOfArray(prices);

                return min !== max ? [
                    ...filters,
                    {
                        ...filter,
                        min,
                        max
                    }
                ] : filters;
            default:
                return [];
            }
        }, []);
    };

    getFilters = (category, products, isSubCategoryFilters) => {
        const { lang } = this.props;
        const currentCategoryName = isSubCategoryFilters ? 'subCategoryFilters' : 'categoryFilters';

        return (category.filters[lang] || []).reduce((filters, filter) => {
            switch (filter.type) {
            case 'checkbox':
                const optionsInProduct = compose(
                    uniq,
                    filterUtil(elem => !!elem),
                    flatten,
                    map(product => product[currentCategoryName].map(productFilter => filter.id === productFilter.id && productFilter.value[lang]))
                )(products);
                const options = filterUtil(option =>
                    any(optionInProduct => option === optionInProduct, optionsInProduct), filter.options.map(filter => filter.name));

                return options.length > 1 ? [
                    ...filters,
                    {
                        ...filter,
                        options
                    }
                ] : filters;
            case 'range':
                const propsArr = compose(
                    uniq,
                    filterUtil(elem => !!elem),
                    flatten,
                    map(product => product[currentCategoryName].map(productFilter => filter.id === productFilter.id && productFilter.value[lang])
                    )
                )(products);

                if (propsArr.length < 2) {
                    return filters;
                }

                const min = getMinOfArray(propsArr);
                const max = getMaxOfArray(propsArr);

                return min !== max ? [
                    ...filters,
                    {
                        ...filter,
                        min,
                        max
                    }
                ] : filters;
            default:
                return filters;
            }
        }, []);
    };

    handleFilter = (filter, values) => {
        this.setState({
            filtersMap: {
                ...this.state.filtersMap,
                [filter.id]: {
                    filter,
                    values
                }
            }
        }, this.filter);
    };

    getFilterValue = (product, filter) => {
        const { isSubCategoryFilters } = this.state;
        const currentCategoryName = isSubCategoryFilters ? 'subCategoryFilters' : 'categoryFilters';
        const { lang } = this.props;
        const productFilterValue = compose(
            prop(lang),
            prop('value'),
            find(productFilter => productFilter.id === filter.id)
        )(product[currentCategoryName]);

        return filter.prop ? product[filter.prop] : productFilterValue;
    };

    filter = () => {
        const { products } = this.state;
        const newFilteredProducts = reduceObj((filteredProducts, { filter, values }) => {
            switch (filter.type) {
            case 'checkbox':
                return !values.length
                    ? filteredProducts
                    : filterUtil(product => {
                        const value = this.getFilterValue(product, filter);

                        return includes(value, values);
                    }, filteredProducts);
            case 'range':
                return filterUtil(product => {
                    const value = this.getFilterValue(product, filter);

                    return values.min <= value && value <= values.max;
                }, filteredProducts);
            default:
                return filteredProducts;
            }
        }, products, this.state.filtersMap);

        this.setState({
            filteredProducts: newFilteredProducts
        });
    };

    handleActiveSortClick = (valueOption, optionsArray) => {
        const { products, filteredProducts } = this.state;
        const sortOption = find(sort => sort.id === valueOption, optionsArray);

        this.setState({
            products: [...products.sort(sortOption.sort)],
            filteredProducts: filteredProducts ? [...filteredProducts.sort(sortOption.sort)] : null
        });
    };

    render () {
        if (!this.state.isCategory) {
            return <NotFoundPage/>;
        }

        const { langMap, langRoute, lang } = this.props;
        const { products, filteredProducts, category, subCategory, subCategories, filters, filtersMap, isPromotionsPage } = this.state;
        const text = propOr('productsPage', {}, langMap);
        const headerText = propOr('header', {}, langMap);
        console.log('category', category);
        console.log('subCategory', subCategory);

        return (
            <div className={styles.productPage}>
                <Breadcrumbs category={category} subCategory={subCategory}
                             noCategoryPage={isPromotionsPage ? headerText.promotions : ''}/>
                <div>
                    <div className={styles.subCategoriesWrap}>
                        <div className={styles.subCategories}>
                            {subCategories.map(subCategory => {
                                return (
                                    <NavLink
                                        className={styles.subCategory}
                                        activeClassName={styles.active}
                                        to={`${langRoute}/${category.alias}/${subCategory.alias}`}
                                        key={subCategory.id}
                                    >
                                        {subCategory.texts[lang].name}
                                    </NavLink>);
                            })}
                        </div>
                    </div>
                    <div className={styles.filterPanelWrap}>
                        <div className={styles.filterPanel}>
                            <div className={styles.btnFilter}>
                                {text.filterBtn}
                            </div>
                            <div className={styles.results}>
                                {`${propOr('length', 0, filteredProducts) || products.length} ${formatWordDeclension(text.results, products.length)}`}
                            </div>
                            {products.length > 1 &&
                            <Fragment>
                                <Filters
                                    filtersMap={filtersMap}
                                    filters={filters}
                                    onFilter={this.handleFilter}
                                />
                                <ProductFilters onFilter={this.handleActiveSortClick}/>
                            </Fragment>}
                        </div>
                    </div>
                </div>
                <div className={styles.productsSection}>
                    <ProductsGrid products={filteredProducts || products}/>
                </div>
            </div>);
    }
}

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        langRoute: application.langRoute,
        lang: application.lang,
        products: data.products,
        categories: data.categories,
        subCategories: data.subCategories,
        labels: data.labels
    };
};

export default withRouter(connect(mapStateToProps)(ProductsPage));
