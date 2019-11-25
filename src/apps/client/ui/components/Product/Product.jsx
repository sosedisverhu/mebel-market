import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './Product.css';

class Product extends Component {
    render () {
        return <div>
            Product
        </div>;
    }
}

export default connect()(Product);
