import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Product from '../../components/Product/Product';
import Tab from '../../components/Tab/Tab';

const mapStateToProps = ({ data }) => {
    return {
        product: data.products[0]
    };
};

class ProductPage extends Component {
    static propTypes = {
        product: PropTypes.object.isRequired
    };

    render () {
        const { product } = this.props;

        return (
            <div>
                <Breadcrumbs />
                <Product product={product} />
                <Tab product={product} />
            </div>
        );
    }
}

export default connect(mapStateToProps)(ProductPage);
