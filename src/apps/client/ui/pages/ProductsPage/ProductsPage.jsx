import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter, matchPath, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import find from '@tinkoff/utils/array/find';
import propOr from '@tinkoff/utils/object/propOr';
import pathOr from '@tinkoff/utils/object/pathOr';
import flatten from '@tinkoff/utils/array/flatten';
import compose from '@tinkoff/utils/function/compose';
import uniq from '@tinkoff/utils/array/uniq';
import map from '@tinkoff/utils/array/map';
import filterUtil from '@tinkoff/utils/array/filter';
import any from '@tinkoff/utils/array/any';
import prop from '@tinkoff/utils/object/prop';
import reduceObj from '@tinkoff/utils/object/reduce';
import includes from '@tinkoff/utils/array/includes';
import intersection from '@tinkoff/utils/array/intersection';

import getMinOfArray from '../../../utils/getMinOfArray';
import getMaxOfArray from '../../../utils/getMaxOfArray';
import formatWordDeclension from '../../../utils/formatWordDeclension';

import NotFoundPage from '../NotFoundPage/NotFoundPage';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import DeliveryOffer from '../../components/DeliveryOffer/DeliveryOffer.jsx';
import Filters from '../../components/Filters/Filters';
import ProductSort from '../../components/ProductSort/ProductSort';
import ProductsGrid from '../../components/ProductsGrid/ProductsGrid';
import styles from './ProductsPage.css';
import classNames from 'classnames';

const DEFAULT_FILTERS = [
    {
        type: 'range',
        min: 0,
        max: 0,
        dimension: '\u20B4',
        id: 'actualPrice',
        prop: 'actualPrice'
    },
    {
        type: 'checkbox',
        id: 'size'
    },
    {
        type: 'checkbox',
        id: 'color'
    }
];

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

    filtersPopup = React.createRef();

    static defaultProps = {
        products: [],
        categories: [],
        subCategories: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            products: [],
            category: {},
            subCategory: {},
            subCategories: [],
            isCategory: true,
            isSubCategoryFilters: false,
            filters: [],
            filteredProducts: [],
            filtersMap: {},
            currentCategoryFiltersName: 'categoryFilters',
            popupIsOpen: false,
            ...this.getNewState()
        };
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.setState({
                ...this.getNewState(nextProps)
            });
        }
    }

    getNewState = (props = this.props) => {
        const { subCategoryAlias } = this.getMatch(props);
        const category = this.getCategory(props);

        if (!category) {
            return {
                isCategory: false
            };
        }

        const subCategory = subCategoryAlias && this.getSubCategory(props);

        if (subCategoryAlias && !subCategory) {
            return {
                isCategory: false
            };
        }

        const { subCategories, langMap } = props;
        const products = this.getFilteredProducts(subCategoryAlias, category, subCategory);
        const isSubCategoryFilters = !!subCategoryAlias;
        const currentCategory = isSubCategoryFilters ? subCategory : category;

        const filters = currentCategory ? flatten([
            this.getDefaultFilters(products, langMap, currentCategory),
            this.getFilters(currentCategory, products, category, subCategory)
        ]) : this.getDefaultFilters(products, langMap, currentCategory);

        return {
            products,
            category,
            subCategory,
            subCategories: subCategories.filter(subCategory => subCategory.categoryId === category.id),
            isCategory: true,
            isSubCategoryFilters,
            filters,
            filteredProducts: products,
            type: subCategoryAlias ? 'subcategory' : 'category'
        };
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

    getFilteredProducts = (subCategoryAlias, category, subCategory, props = this.props) => {
        const { products } = props;
        const filteredProductsByCategory = products.filter(product => product.categoryId === category.id);

        return subCategoryAlias
            ? filteredProductsByCategory
                .filter(product => product.subCategoryId === subCategory.id)
                .sort((product, nextProduct) => {
                    if (!subCategoryAlias) {
                        return product.positionIndexInCategory - nextProduct.positionIndexInCategory;
                    } else {
                        return product.positionIndexInSubCategory - nextProduct.positionIndexInSubCategory;
                    }
                })
            : filteredProductsByCategory
                .sort((product, nextProduct) => {
                    if (!subCategoryAlias) {
                        return product.positionIndexInCategory - nextProduct.positionIndexInCategory;
                    } else {
                        return product.positionIndexInSubCategory - nextProduct.positionIndexInSubCategory;
                    }
                });
    };

    getDefaultFilters = (products, langMap, currentCategory) => {
        const { lang } = this.props;
        const text = propOr('productsPage', {}, langMap);
        return DEFAULT_FILTERS.reduce((filters, filter) => {
            switch (filter.type) {
            case 'checkbox':
                if (filter.id === 'size' && currentCategory.sizeFilter) {
                    const options = [];
                    products.forEach(product => {
                        product.sizes[lang].forEach(size => {
                            if (options.every(option => option.name !== size.name.trim())) {
                                options.push({ id: size.name.trim(), name: size.name.trim() });
                            }
                        });
                    });

                    return options.length > 1 ? [
                        ...filters,
                        {
                            ...filter,
                            name: text[`filter_${filter.id}`],
                            options
                        }
                    ] : filters;
                }

                if (filter.id === 'color' && currentCategory.colorFilter) {
                    const options = [];
                    products.forEach(product => {
                        product.sizes[lang].forEach(size => {
                            size.colors.forEach(color => {
                                if (options.every(option => option.name !== color.name.trim())) {
                                    options.push({ id: color.name.trim(), name: color.name.trim() });
                                }
                            });
                        });
                    });

                    return options.length > 1 ? [
                        ...filters,
                        {
                            ...filter,
                            name: text[`filter_${filter.id}`],
                            options
                        }
                    ] : filters;
                }

                return filters;
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
                        name: text[`filter_${filter.id}`],
                        min,
                        max
                    }
                ] : filters;
            default:
                return [];
            }
        }, []);
    };

    getFilters = (currentCategory, products, category, subCategory) => {
        const { lang } = this.props;
        const currentCategoryName = subCategory ? 'subCategoryFilters' : 'categoryFilters';
        const currentCategoryFilters = category.filters[lang];

        if (subCategory) {
            const requiredCategoryFilters = category.filters[lang].filter(categoryFilter => categoryFilter.viewInAnotherFilters);
            requiredCategoryFilters.forEach(requiredCategoryFilter => {
                if (!currentCategoryFilters.find(currentCategoryFilter => currentCategoryFilter.id === requiredCategoryFilter.id)) {
                    currentCategoryFilters.push(requiredCategoryFilter);
                }
            });
        }

        return (currentCategoryFilters || []).reduce((filters, filter) => {
            switch (filter.type) {
            case 'checkbox':
                const optionsInProduct = compose(
                    uniq,
                    filterUtil(elem => !!elem),
                    flatten,
                    map(product => {
                        const productFilters = [...product[currentCategoryName]];
                        if (subCategory) {
                            const requiredCategoryFilters = category.filters[lang]
                                .filter(categoryFilter => categoryFilter.viewInAnotherFilters)
                                .map(categoryFilter => product.categoryFilters.find(filter => filter.id === categoryFilter.id));
                            productFilters.push(...requiredCategoryFilters);
                        }
                        return productFilters.map(productFilter => filter.id === productFilter.id && productFilter.value);
                    })
                )(products);

                const options = filterUtil(option =>
                    any(optionInProduct => option.id === optionInProduct, optionsInProduct), filter.options.map(filter => filter));

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
                    map(product => product[currentCategoryName].map(productFilter => filter.id === productFilter.id && productFilter.value)
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
        const productFilterValue = compose(
            prop('value'),
            find(productFilter => productFilter.id === filter.id)
        )([...product.categoryFilters, ...product.subCategoryFilters]);

        return filter.prop ? product[filter.prop] : productFilterValue;
    };

    filter = () => {
        const { lang } = this.props;
        const { products } = this.state;
        const newFilteredProducts = reduceObj((filteredProducts, { filter, values }) => {
            switch (filter.type) {
            case 'checkbox':
                if (!values.length) return filteredProducts;
                if (filter.id === 'size') {
                    return filterUtil(product => {
                        return !!intersection(product.sizes[lang].map(size => size.name), values).length;
                    }, filteredProducts);
                }
                if (filter.id === 'color') {
                    return filterUtil(product => {
                        const sizes = product.sizes[lang];
                        const colors = flatten(sizes.map(size => size.colors));
                        return !!intersection(colors.map(color => color.name), values).length;
                    }, filteredProducts);
                }
                return filterUtil(product => {
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
        const { products, filteredProducts, type } = this.state;
        const sortOption = find(sort => sort.id === valueOption, optionsArray);

        this.setState({
            products: [...products.sort(sortOption.sort(type))],
            filteredProducts: filteredProducts ? [...filteredProducts.sort(sortOption.sort(type))] : products
        });
    };

    handlePopupChange = () => {
        const { popupIsOpen } = this.state;

        document.body.style.overflowY = !popupIsOpen ? 'hidden' : 'visible';
        document.documentElement.style.overflowY = !popupIsOpen ? 'hidden' : 'visible'; // для Safari на iPhone/iPad

        this.setState(state => ({ popupIsOpen: !state.popupIsOpen }));
    };

    handleFilterMapChanged = filtersMap => {
        this.setState({
            filtersMap
        }, this.filter);
    };

    handleFiltersClear = () => {
        this.handlePopupChange();
        this.handleFilterMapChanged({});
    }

    render () {
        if (!this.state.isCategory) {
            return <NotFoundPage/>;
        }

        const { langMap, langRoute, lang } = this.props;
        const { products, filteredProducts, category, subCategory, subCategories, filters, filtersMap, popupIsOpen } = this.state;
        const text = propOr('productsPage', {}, langMap);
        const activeSizes = pathOr(['filtersMap', 'size', 'values'], [], this.state);

        return (
            <div className={styles.productPage}>
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
                    <Breadcrumbs
                        category={category}
                        subCategory={subCategory}
                        noCategoryPage=''/>
                    <DeliveryOffer mobile/>
                    <div className={styles.filterPanelWrap}>
                        <div className={styles.filterPanel}>
                            <div className={styles.btnFilter} onClick={this.handlePopupChange}>
                                {text.filterBtn}
                            </div>
                            <div className={styles.results}>
                                {`${propOr('length', 0, filteredProducts)} ${formatWordDeclension(text.results, products.length)}`}
                            </div>
                            {products.length > 1 &&
                            <Fragment>
                                <Filters
                                    filtersMap={filtersMap}
                                    filters={filters}
                                    onFilter={this.handleFilter}
                                />
                                <ProductSort onFilter={this.handleActiveSortClick}/>
                            </Fragment>}
                        </div>
                    </div>
                </div>
                <div className={styles.productsSection}>
                    <ProductsGrid
                        products={filteredProducts || products}
                        activeSizes={activeSizes}
                    />
                </div>
                <div className={classNames(styles.popupContainer, { [styles.active]: popupIsOpen })}>
                    <div className={styles.cover} onClick={this.handlePopupChange}/>
                    <div className={styles.popup} ref={this.filtersPopup}>
                        <div className={styles.popupHeader}>
                            <button className={styles.popupBtnClear} type='button' onClick={this.handleFiltersClear}>{text.popupBtnClear}</button>
                            <h3 className={styles.popupTitle}>{text.popupTitle}</h3>
                            <button className={styles.popupBtnDone} type='button' onClick={this.handlePopupChange}>{text.popupBtnDone}</button>
                        </div>
                        <Filters mobile={true} filtersMap={filtersMap} filters={filters} onFilter={this.handleFilter} />
                        <button className={styles.popupBtnApply} type='button' onClick={this.handlePopupChange}>{text.popupBtnApply}</button>
                    </div>
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
