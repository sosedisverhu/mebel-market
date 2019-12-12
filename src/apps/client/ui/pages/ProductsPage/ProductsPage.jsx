import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, matchPath, Link } from 'react-router-dom';

import propOr from '@tinkoff/utils/object/propOr';
import find from '@tinkoff/utils/array/find';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Filters from '../../components/Filters/Filters';
import ProductsGrid from '../../components/ProductsGrid/ProductsGrid';
import styles from './ProductsPage.css';

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
        subCategories: []
    };

    componentDidMount () {
        const category = this.getCategory();

        this.setNewState(category);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            const category = this.getCategory(nextProps);

            this.setNewState(category, nextProps);
        }
    }

    setNewState = (category, props = this.props) => {
        const { products, subCategories } = props;
        const match = this.getMatch(props);
        const filteredProducts = products.filter(product => product.categoryId === category.id);
        const subCategory = this.getSubCategory(props);

        this.setState({
            products: match.params.subCategoryAlias ? filteredProducts.filter(product => product.subCategoryId === subCategory.id) : filteredProducts,
            category,
            subCategories: subCategories.filter(subCategory => {
                return subCategory.categoryId === category.id;
            })
        });
    };

    getMatch = props => {
        const { location: { pathname }, langRoute } = props;
        const subCategoryAlias = pathname.split('').filter(symbol => symbol === '/').length === 2 ? '/:subCategoryAlias' : '';
        const CATEGORY_PATH = `${langRoute}/:categoryAlias${subCategoryAlias}`;

        return matchPath(pathname, { path: CATEGORY_PATH, exact: true });
    };

    getCategory = (props = this.props) => {
        const match = this.getMatch(props);

        return find(category => category.alias === match.params.categoryAlias, props.categories);
    };

    getSubCategory = (props = this.props) => {
        const match = this.getMatch(props);
        const category = this.getCategory(props);

        return find(subCategory => (subCategory.categoryId === category.id && subCategory.alias === match.params.subCategoryAlias), props.subCategories);
    };

    render () {
        const { langMap, langRoute, lang } = this.props;
        const { products, category, subCategories } = this.state;
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

export default withRouter(connect(mapStateToProps)(ProductsPage));
