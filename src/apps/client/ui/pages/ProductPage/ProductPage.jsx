import React, { Component } from 'react';

import { connect } from 'react-redux';

import styles from './ProductPage.css';

import Product from '../../components/Product/Product';
import Tab from '../../components/Tab/Tab';

class ProductPage extends Component {
    render () {
        return (
            <div>
                <Product />
                <Tab />
            </div>
        );
    }
}

export default connect()(ProductPage);
