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
        labels: PropTypes.array.isRequired,
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
        category: {},
        subCategories: []
    };

    componentDidMount () {
        const category = this.getCategory();

        this.setState({
            category,
            subCategories: this.props.subCategories.filter((subCategory) => {
                return subCategory.categoryId === category.id;
            })
        });
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname || this.props.lang !== nextProps.lang) {
            const category = this.getCategory(nextProps);

            this.setState({
                category,
                subCategories: this.props.subCategories.filter((subCategory) => {
                    return subCategory.categoryId === category.id;
                })
            });
        }
    }

    getCategory = (props = this.props) => {
        const { location: { pathname }, langRoute, categories } = props;
        const CATEGORY_PATH = `${langRoute}/:categoryAlias`;
        const match = matchPath(pathname, { path: CATEGORY_PATH, exact: true });

        return find(category => category.alias === match.params.categoryAlias, categories);
    };

    render () {
        const { langMap, lang, products } = this.props;
        const { category, subCategories } = this.state;
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
                                        to=''
                                        key={subCategory.id}
                                    >
                                        {subCategory.texts[lang].name}
                                    </Link>);
                            })}
                        </div>
                    </div>
                    <div className={styles.filterPanelWrap}>
                        <div className={styles.filterPanel}>
                            <div className={styles.btnFilter}>{text.filterBtn}</div>
                            <div className={styles.results}>12 результатов</div>
                            <Filters/>
                            <div className={styles.sort}>
                                <div className={styles.activeOption}>Популярные</div>
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
