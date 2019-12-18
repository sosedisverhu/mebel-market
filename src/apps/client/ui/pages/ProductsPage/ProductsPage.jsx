import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, matchPath, NavLink } from 'react-router-dom';

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
        subCategories: [],
        isCategory: true
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

        const { products, subCategories } = props;
        const filteredProducts = products.filter(product => product.categoryId === category.id);

        this.setState({
            products: subCategoryAlias ? filteredProducts.filter(product => product.subCategoryId === subCategory.id) : filteredProducts,
            category,
            subCategories: subCategories.filter(subCategory => subCategory.categoryId === category.id),
            isCategory: true
        });
    };

    getMatch = props => {
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

    render () {
        const { langMap, langRoute, lang } = this.props;
        const { products, category, subCategories, isCategory } = this.state;
        const text = propOr('productsPage', {}, langMap);

        if (!isCategory) {
            return <NotFoundPage/>;
        }

        return (
            <div className={styles.productPage}>
                <Breadcrumbs category={category}/>
                <div>
                    <div className={styles.subCategoriesWrap}>
                        <div className={styles.subCategories}>
                            {subCategories.map((subCategory) => {
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
                                {`${products.length} ${text.results}`}
                            </div>
                            <Filters/>
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
