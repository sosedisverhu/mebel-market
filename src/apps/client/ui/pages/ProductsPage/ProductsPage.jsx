import React, { Component } from 'react';
import PropTypes from 'prop-types';
import propOr from '@tinkoff/utils/object/propOr';
import includes from '@tinkoff/utils/array/includes';
import { connect } from 'react-redux';

import styles from './ProductsPage.css';
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
        const { products } = this.props;

        return (
            <div>
                <ProductsGrid products={products} />
            </div>);
    }
}

export default connect(mapStateToProps)(ProductsPage);
