import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import propOr from '@tinkoff/utils/object/propOr';

import styles from './ProductsPage.css';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Filters from '../../components/Filters/Filters';
import ProductsGrid from '../../components/ProductsGrid/ProductsGrid';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        products: data.products,
        labels: data.labels
    };
};

class ProductsPage extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        labels: PropTypes.array.isRequired,
        products: PropTypes.array.isRequired
    };

    render () {
        const { products, langMap } = this.props;
        const text = propOr('productsPage', {}, langMap);

        return (
            <div className={styles.productPage}>
                <Breadcrumbs />
                <div className={styles.topPanel}>
                    <div className={styles.subCategoriesWrap}>
                        <div className={styles.subCategories}>
                            <Link className={styles.subCategory} to='/'>Металлические кровати</Link>
                            <Link className={styles.subCategory} to='/'>Деревянные кровати</Link>
                            <Link className={styles.subCategory} to='/'>Двухъярусные кровати</Link>
                        </div>
                    </div>
                    <div className={styles.filterPanelWrap}>
                        <div className={styles.filterPanel}>
                            <div className={styles.btnFilter}>{text.filterBtn}</div>
                            <div className={styles.results}>12 результатов</div>
                            <Filters />
                            <div className={styles.sort}>
                                <div className={styles.activeOption}>Популярные</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.productsSection}>
                    <ProductsGrid products={products} />
                </div>
            </div>);
    }
}

export default connect(mapStateToProps)(ProductsPage);
