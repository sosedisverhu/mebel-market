import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, matchPath, Link } from 'react-router-dom';

import propOr from '@tinkoff/utils/object/propOr';
import find from '@tinkoff/utils/array/find';

import NotFoundPage from '../NotFoundPage/NotFoundPage';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Filters from '../../components/Filters/Filters';
import ProductsGrid from '../../components/ProductsGrid/ProductsGrid';
import styles from './ProductsPage.css';

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
        filtersState: [],
        minAndMaxPrices: {}
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
        const { subCategoryAlias } = this.getMatch(props);
        const category = this.getCategory(props);
        const subCategory = subCategoryAlias && this.getSubCategory(props);

        if ((!category) || (subCategoryAlias && !subCategory)) {
            this.setState({
                isCategory: false
            });
            return;
        }

        const { subCategories, lang } = props;
        const products = this.getFilteredProducts(props);
        const isSubCategoryFilters = !!subCategoryAlias;

        const filters = propOr(lang, [], !isSubCategoryFilters ? category.filters : subCategory.filters);
        const filtersState = filters.map(filter => {
            if (filter.type === 'checkbox') {
                return {
                    ...filter,
                    options: filter.options.map(option => {
                        return { ...option, checked: true };
                    })
                };
            }
        }).filter(filter => filter);

        this.setState({
            products,
            category,
            subCategory,
            subCategories: subCategories.filter(subCategory => subCategory.categoryId === category.id),
            isCategory: true,
            isSubCategoryFilters,
            minAndMaxPrices: this.getMinAndMaxPrices(products),
            filters,
            filtersState
        });
    };

    getMatch = (props = this.props) => {
        const { location: { pathname }, langRoute } = props;
        const subCategoryAlias = pathname.split('').filter(symbol => symbol === '/').length === 2 ? '/:subCategoryAlias' : '';
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

    getFilteredProducts = (props = this.props) => {
        const { subCategoryAlias } = this.getMatch(props);
        const category = this.getCategory(props);
        const subCategory = subCategoryAlias && this.getSubCategory(props);

        const { products } = props;
        const filteredProductsByCategory = products.filter(product => product.categoryId === category.id);

        return subCategoryAlias ? filteredProductsByCategory.filter(product => product.subCategoryId === subCategory.id)
            : filteredProductsByCategory;
    };

    getMinAndMaxPrices = products => {
        const defaultPrice = products.length ? (products[0].discountPrice || products[0].price) : 0;

        return products.reduce((previousValue, product) => {
            const price = product.discountPrice || product.price;
            return {
                min: price < previousValue.min ? price : previousValue.min,
                max: price > previousValue.max ? price : previousValue.max
            };
        }, { min: defaultPrice, max: defaultPrice });
    };

    onFilter = (id, options) => {
        const { filtersState, isSubCategoryFilters } = this.state;
        const { lang } = this.props;
        const products = this.getFilteredProducts();
        const newFiltersState = filtersState.map(filter => {
            if (filter.id === id) {
                return { ...filter, options };
            }
            return filter;
        });
        const filterType = isSubCategoryFilters ? 'subCategoryFilters' : 'categoryFilters';

        const filteredProducts = products.filter(product => {
            return product[filterType].every(productFilter => {
                const currentFilter = newFiltersState.filter(filter => filter.id === productFilter.id)[0];
                if (!currentFilter) {
                    return true;
                }
                if (currentFilter.options.every(option => !option.checked)) {
                    return true;
                }

                return currentFilter.options.filter(option => {
                    return option.name === productFilter.value[lang];
                })[0].checked;
            });
        });

        this.setState({
            filtersState: newFiltersState,
            products: filteredProducts
        });
    };

    render () {
        if (!this.state.isCategory) {
            return <NotFoundPage/>;
        }

        const { langMap, langRoute, lang } = this.props;
        const { products, category, subCategories, filters } = this.state;
        const text = propOr('productsPage', {}, langMap);

        return (
            <div className={styles.productPage}>
                <Breadcrumbs category={category}/>
                <div>
                    <div className={styles.subCategoriesWrap}>
                        <div className={styles.subCategories}>
                            {subCategories.map((subCategory) => {
                                return (
                                    <Link className={styles.subCategory}
                                        to={`${langRoute}/${category.alias}/${subCategory.alias}`}
                                        key={subCategory.id}
                                    >
                                        {subCategory.texts[lang].name}
                                    </Link>);
                            })}
                        </div>
                    </div>
                    <div className={styles.filterPanelWrap}>
                        <div className={styles.filterPanel}>
                            <div className={styles.btnFilter}>
                                {text.filterBtn}
                            </div>
                            <div className={styles.results}>
                                {`${products.length} ${text.results}`}
                            </div>
                            <Filters
                                filters={filters}
                                onFilter={this.onFilter}
                            />
                            <div className={styles.sort}>
                                <div className={styles.activeOption}>
                                    {text.popular}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.productsSection}>
                    <ProductsGrid products={products}/>
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
