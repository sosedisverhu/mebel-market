import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import find from '@tinkoff/utils/array/find';
import propOr from '@tinkoff/utils/object/propOr';
import compose from '@tinkoff/utils/function/compose';
import uniq from '@tinkoff/utils/array/uniq';
import map from '@tinkoff/utils/array/map';
import filterUtil from '@tinkoff/utils/array/filter';
import reduceObj from '@tinkoff/utils/object/reduce';
import includes from '@tinkoff/utils/array/includes';

import getMinOfArray from '../../../utils/getMinOfArray';
import getMaxOfArray from '../../../utils/getMaxOfArray';
import formatWordDeclension from '../../../utils/formatWordDeclension';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ProductSort from '../../components/ProductSort/ProductSort';
import ProductsGrid from '../../components/ProductsGrid/ProductsGrid';
import Filters from '../../components/Filters/Filters';

import styles from './PromotionsPage.css';

const DEFAULT_FILTERS = name => {
    return [
        {
            name: name,
            type: 'range',
            min: 0,
            max: 0,
            dimension: '\u20B4',
            id: 'actualPrice',
            prop: 'actualPrice'
        }
    ];
};

class PromotionsPage extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        langMap: PropTypes.object.isRequired,
        langRoute: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired,
        products: PropTypes.array
    };

    static defaultProps = {
        products: []
    };

    state = {
        products: [],
        filters: [],
        filteredProducts: [],
        filtersMap: {}
    };

    componentDidMount () {
        this.setNewState();
    }

    setNewState = () => {
        const { langMap } = this.props;
        const products = this.getActionProducts();
        const filters = this.getDefaultFilters(products, langMap);

        this.setState({
            products,
            filters,
            filteredProducts: products
        });
    };

    getActionProducts = () => {
        const { products, lang } = this.props;

        return products.filter(product => product.sizes[lang].some(size => size.colors.some(color => color.action)));
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

    handleActiveSortClick = (valueOption, optionsArray) => {
        const { products, filteredProducts } = this.state;
        const sortOption = find(sort => sort.id === valueOption, optionsArray);

        this.setState({
            products: [...products.sort(sortOption.sort())],
            filteredProducts: filteredProducts ? [...filteredProducts.sort(sortOption.sort())] : products
        });
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

    filter = () => {
        const { products } = this.state;
        const newFilteredProducts = reduceObj((filteredProducts, { filter, values }) => {
            switch (filter.type) {
            case 'checkbox':
                return !values.length
                    ? filteredProducts
                    : filterUtil(product => {
                        const value = product[filter.prop];

                        return includes(value, values);
                    }, filteredProducts);
            case 'range':
                return filterUtil(product => {
                    const value = product[filter.prop];

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

    render () {
        const { langMap } = this.props;
        const { products, filteredProducts, filters, filtersMap } = this.state;
        const text = propOr('productsPage', {}, langMap);
        const headerText = propOr('header', {}, langMap);

        return (
            <div className={styles.productPage}>
                <div>
                    <Breadcrumbs noCategoryPage={headerText.promotions}/>
                    <div className={styles.filterPanelWrap}>
                        <div className={styles.filterPanel}>
                            <div className={styles.btnFilter}>
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
                    <ProductsGrid isPromotion={true} products={filteredProducts || products}/>
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
        labels: data.labels
    };
};

export default withRouter(connect(mapStateToProps)(PromotionsPage));
